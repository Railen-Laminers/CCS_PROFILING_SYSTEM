const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema(
  {
    interfaceLanguage: { type: String, trim: true, default: 'English - North America' },
    academicYear: { type: String, trim: true, default: '2023-2024' },
    semester: { type: String, trim: true, default: '1st Semester' },
    logoUrl: { type: String, trim: true, default: null },
    logoFilename: { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);

