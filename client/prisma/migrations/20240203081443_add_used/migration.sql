-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PasswordResetRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PasswordResetRequest" ("createdAt", "id", "token", "userId") SELECT "createdAt", "id", "token", "userId" FROM "PasswordResetRequest";
DROP TABLE "PasswordResetRequest";
ALTER TABLE "new_PasswordResetRequest" RENAME TO "PasswordResetRequest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
