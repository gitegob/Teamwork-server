import { DataTypes } from 'sequelize';
import db from '../config/db';
import Comment from './Comment';
import User from './User';

const CommentFlag = db.define('commentFlag', {
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: false,
});
CommentFlag.belongsTo(User, { as: 'author', onDelete: 'cascade' });
CommentFlag.belongsTo(Comment, { onDelete: 'cascade' });
export default CommentFlag;
