const path = require('path');
const fs = require('fs');
const SystemSettings = require('../models/SystemSettings');
const Student = require('../models/Student');
const Class = require('../models/Class');
const LessonPlan = require('../models/LessonPlan');
const Material = require('../models/Material');
const AcademicRecord = require('../models/AcademicRecord');
const User = require('../models/User');

const pickPublicSettings = (doc) => ({
  id: doc?._id,
  interfaceLanguage: doc?.interfaceLanguage || 'English - North America',
  academicYear: doc?.academicYear || '2023-2024',
  semester: doc?.semester || '1st Semester',
  logoUrl: doc?.logoUrl || null,
});

const performSystemRollover = async (oldYear, oldSemester, newYear, newSemester) => {
  console.log(`🔄 System Rollover initiated: [${oldYear} | ${oldSemester}] -> [${newYear} | ${newSemester}]`);
  
  // 1. Snapshot and Reset Student Data
  const students = await Student.find().populate('user_id');
  
  for (const student of students) {
    // Only archive if they have some data or were active
    if (student.current_subjects?.length > 0 || student.gpa) {
      await AcademicRecord.create({
        student_id: student._id,
        year_level: student.year_level ? `${student.year_level} Year` : 'N/A',
        semester: oldSemester,
        gpa: student.gpa,
        current_subjects: student.current_subjects,
        academic_awards: student.academic_awards,
        quiz_bee_participations: student.quiz_bee_participations,
        programming_contests: student.programming_contests
      });
    }

    // Reset "Live" fields
    student.gpa = null;
    student.current_subjects = [];
    student.academic_awards = [];
    student.quiz_bee_participations = [];
    student.programming_contests = [];
    student.behavior_discipline_records = {
      warnings: 0,
      suspensions: 0,
      counseling: 0,
      incidents: '',
      counselingRecords: ''
    };

    // Promote year level if Academic Year changed and student is active
    if (oldYear !== newYear && student.year_level && student.user_id?.is_active) {
      // If student is Year 4, we don't promote further (they graduate)
      // Otherwise increment
      if (student.year_level < 4) {
        student.year_level += 1;
      }
    }

    await student.save();
  }

  // 2. Clear Instructional Data (Schedules)
  await Class.deleteMany({});
  await LessonPlan.deleteMany({});
  await Material.deleteMany({});
  
  console.log('✅ System Rollover completed successfully.');
};

const getOrCreateSingleton = async () => {
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = await SystemSettings.create({});
  }
  return settings;
};

exports.getSystemSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSingleton();
    res.json({ settings: pickPublicSettings(settings) });
  } catch (err) {
    next(err);
  }
};

exports.updateSystemSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSingleton();

    const nextData = {
      interfaceLanguage: req.body.interfaceLanguage ?? settings.interfaceLanguage,
      academicYear: req.body.academicYear ?? settings.academicYear,
      semester: req.body.semester ?? settings.semester,
    };

    // If a new logo file is uploaded, store its URL and remove old file (best-effort)
    if (req.file) {
      const newFilename = req.file.filename;
      const newUrl = `/uploads/${newFilename}`;

      const oldFilename = settings.logoFilename;
      nextData.logoFilename = newFilename;
      nextData.logoUrl = newUrl;

      if (oldFilename && oldFilename !== newFilename) {
        const oldPath = path.join(__dirname, '../../uploads', oldFilename);
        fs.promises.unlink(oldPath).catch(() => {});
      }
    }

    const oldYear = settings.academicYear;
    const oldSemester = settings.semester;
    const isRollover = (req.body.academicYear && req.body.academicYear !== oldYear) || 
                       (req.body.semester && req.body.semester !== oldSemester);

    settings.set(nextData);
    await settings.save();

    // Trigger rollover if needed
    if (isRollover) {
      await performSystemRollover(oldYear, oldSemester, settings.academicYear, settings.semester);
    }

    res.json({ settings: pickPublicSettings(settings) });
  } catch (err) {
    next(err);
  }
};

