import { DataTypes } from 'sequelize';
import db from '../config/db';
import Article from './Article';
import User from './User';

const ArticleFlag = db.define('article_flag', {
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Article,
      key: 'id',
    },
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: false,
});
export default ArticleFlag;
