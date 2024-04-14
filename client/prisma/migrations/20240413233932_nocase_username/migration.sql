-- This is an empty migration.
-- Alter user table to make user case insensitive
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL COLLATE NOCASE,
    "email" TEXT NOT NULL COLLATE NOCASE,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO new_User SELECT * FROM User;
DROP TABLE User;
ALTER TABLE new_User RENAME TO User;
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
