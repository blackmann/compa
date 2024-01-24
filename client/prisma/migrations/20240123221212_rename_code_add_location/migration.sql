/*
  Warnings:

  - You are about to drop the column `courseCode` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Programme` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `location` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseId" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "programmeId" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "timeEnd" INTEGER NOT NULL,
    "timeStart" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    CONSTRAINT "Schedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schedule_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schedule_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("courseId", "day", "id", "instructorId", "level", "programmeId", "semester", "timeEnd", "timeStart", "year") SELECT "courseId", "day", "id", "instructorId", "level", "programmeId", "semester", "timeEnd", "timeStart", "year" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_Course" ("id", "name", "slug") SELECT "id", "name", "slug" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Programme_name_key" ON "Programme"("name");
