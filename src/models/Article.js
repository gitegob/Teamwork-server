import { DataTypes } from 'sequelize';
import db from '../config/db';
import User from './User';

const Article = db.define('article', {
  authorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  article: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: false,
});

Article.belongsTo(User, { as: 'author', onDelete: 'cascade' });
export default Article;
