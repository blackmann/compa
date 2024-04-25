-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Community" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modPhone" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "members" INTEGER NOT NULL DEFAULT 0,
    "createdById" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Community_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Community" ("createdAt", "createdById", "description", "handle", "id", "members", "modPhone", "name", "status", "updatedAt") SELECT "createdAt", "createdById", "description", "handle", "id", "members", "modPhone", "name", "status", "updatedAt" FROM "Community";
DROP TABLE "Community";
ALTER TABLE "new_Community" RENAME TO "Community";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'common'
);
INSERT INTO "new_User" ("createdAt", "email", "id", "updatedAt", "username", "verified") SELECT "createdAt", "email", "id", "updatedAt", "username", "verified" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_CommunityMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "communityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'common',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommunityMember_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommunityMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommunityMember" ("communityId", "createdAt", "id", "role", "userId") SELECT "communityId", "createdAt", "id", "role", "userId" FROM "CommunityMember";
DROP TABLE "CommunityMember";
ALTER TABLE "new_CommunityMember" RENAME TO "CommunityMember";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
