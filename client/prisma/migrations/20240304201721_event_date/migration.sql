/*
  Warnings:

  - Added the required column `date` to the `EventItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `EventItem` table without a default value. This is not possible if the table is not empty.

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
    "mediaId" INTEGER,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "EventItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventItem_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_EventItem" ("createdAt", "description", "endTime", "eventLink", "id", "mapsLink", "mediaId", "shortDescription", "startTime", "title", "updatedAt", "venue") SELECT "createdAt", "description", "endTime", "eventLink", "id", "mapsLink", "mediaId", "shortDescription", "startTime", "title", "updatedAt", "venue" FROM "EventItem";
DROP TABLE "EventItem";
ALTER TABLE "new_EventItem" RENAME TO "EventItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
