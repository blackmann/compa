-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "quoteId" INTEGER,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "people" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("commentsCount", "content", "createdAt", "deleted", "downvotes", "id", "parentId", "people", "quoteId", "updatedAt", "upvotes", "userId") SELECT "commentsCount", "content", "createdAt", "deleted", "downvotes", "id", "parentId", "people", "quoteId", "updatedAt", "upvotes", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
