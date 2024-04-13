-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "actorId" INTEGER NOT NULL,
    "entityId" INTEGER NOT NULL,
    "entityType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotificationSuscribers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notificationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "NotificationSuscribers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NotificationSuscribers_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
