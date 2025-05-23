/*
  Warnings:

  - You are about to drop the column `category` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "category",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "tags",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "createdAt",
DROP COLUMN "lastLogin",
DROP COLUMN "role",
DROP COLUMN "status";
