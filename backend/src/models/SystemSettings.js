const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema(
  {
    systemTitle: { type: String, trim: true, default: '' },
    institutionName: { type: String, trim: true, default: '' },
    interfaceLanguage: { type: String, trim: true, default: 'English - North America' },
    logoUrl: { type: String, trim: true, default: null },
    logoFilename: { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);

