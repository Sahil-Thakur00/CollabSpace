const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    board_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, default: '' },
    pos_x: { type: Number, default: 0 },
    pos_y: { type: Number, default: 0 },
    color: { type: String, default: '#FEF08A' },
    height: { type: Number, default: 150 },
    z_index: { type: Number, default: 1 },
  },
  { timestamps: true }
);

postSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.board_id = ret.board_id.toString();
    ret.user_id = ret.user_id.toString();
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

module.exports = mongoose.model('Post', postSchema);