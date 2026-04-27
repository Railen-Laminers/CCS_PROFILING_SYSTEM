const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    actor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    actor_user_id: {
      type: String,
      default: null,
      trim: true
    },
    actor_name: {
      type: String,
      default: null,
      trim: true
    },
    actor_role: {
      type: String,
      default: null
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true
    },
    method: {
      type: String,
      default: null
    },
    endpoint: {
      type: String,
      default: null
    },
    target_resource: {
      type: String,
      default: null,
      trim: true
    },
    status_code: {
      type: Number,
      default: null
    },
    ip_address: {
      type: String,
      default: null
    },
    user_agent: {
      type: String,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ actor_id: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
