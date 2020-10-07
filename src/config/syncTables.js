import { config } from 'dotenv';
import db from './db';
import log from './debug';

config();
const syncQueries = `DROP TABLE IF EXISTS "users","articleFlags","articles","commentFlags","comments","passwords" CASCADE;
CREATE TABLE IF NOT EXISTS "users" ("id"   SERIAL , "firstName" VARCHAR(255) NOT NULL, "lastName" VARCHAR(255) NOT NULL, "email" VARCHAR(255) NOT NULL UNIQUE, "gender" VARCHAR(255) NOT NULL, "jobRole" VARCHAR(255) NOT NULL, "address" VARCHAR(255) NOT NULL, "isAdmin" BOOLEAN DEFAULT false, PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "articles" ("id"   SERIAL , "authorName" VARCHAR(255) NOT NULL, "title" VARCHAR(255) NOT NULL, "article" VARCHAR(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "authorId" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "comments" ("id"   SERIAL , "comment" VARCHAR(255) NOT NULL, "postedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "authorId" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, "articleId" INTEGER REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "articleFlags" ("id"   SERIAL , "reason" VARCHAR(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "authorId" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, "articleId" INTEGER REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "commentFlags" ("id"   SERIAL , "reason" VARCHAR(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "authorId" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, "commentId" INTEGER REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "passwords" ("id"   SERIAL , "password" TEXT NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("id"));`;

log.db(process.env.NODE_ENV);
db.query(syncQueries).then(() => {
  db.close();
}).catch((error) => log.error(error));
