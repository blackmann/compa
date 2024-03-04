/*
  Warnings:

  - You are about to drop the column `mediaId` on the `EventItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EventItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "date" DATETIME NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER,
    "venue" TEXT NOT NULL,
    "mapsLink" TEXT,
    "eventLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "posterId" INTEGER,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "EventItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventItem_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_EventItem" ("createdAt", "date", "description", "endTime", "eventLink", "id", "mapsLink", "shortDescription", "startTime", "title", "updatedAt", "userId", "venue") SELECT "createdAt", "date", "description", "endTime", "eventLink", "id", "mapsLink", "shortDescription", "startTime", "title", "updatedAt", "userId", "venue" FROM "EventItem";
DROP TABLE "EventItem";
ALTER TABLE "new_EventItem" RENAME TO "EventItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
