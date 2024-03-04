-- CreateTable
CREATE TABLE "EventItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER,
    "venue" TEXT NOT NULL,
    "mapsLink" TEXT,
    "eventLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mediaId" INTEGER,
    CONSTRAINT "EventItem_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
