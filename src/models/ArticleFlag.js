import { DataTypes } from 'sequelize';
import db from '../config/db';
import Article from './Article';
import User from './User';

const ArticleFlag = db.define('articleFlag', {
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: false,
});

ArticleFlag.belongsTo(User, { as: 'author', onDelete: 'cascade' });
ArticleFlag.belongsTo(Article, { onDelete: 'cascade' });

export default ArticleFlag;
