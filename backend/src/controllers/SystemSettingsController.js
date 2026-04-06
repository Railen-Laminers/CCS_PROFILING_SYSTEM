const path = require('path');
const fs = require('fs');
const SystemSettings = require('../models/SystemSettings');

const pickPublicSettings = (doc) => ({
  id: doc?._id,
  systemTitle: doc?.systemTitle || '',
  institutionName: doc?.institutionName || '',
  interfaceLanguage: doc?.interfaceLanguage || 'English - North America',
  logoUrl: doc?.logoUrl || null,
});

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
      systemTitle: req.body.systemTitle ?? settings.systemTitle,
      institutionName: req.body.institutionName ?? settings.institutionName,
      interfaceLanguage: req.body.interfaceLanguage ?? settings.interfaceLanguage,
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

    settings.set(nextData);
    await settings.save();

    res.json({ settings: pickPublicSettings(settings) });
  } catch (err) {
    next(err);
  }
};

