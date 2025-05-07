/*
  Warnings:

  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First, add the columns with NULL constraint
ALTER TABLE "Users" ADD COLUMN "password" TEXT;
ALTER TABLE "Users" ADD COLUMN "createdAt" TEXT;
ALTER TABLE "Users" ADD COLUMN "lastLogin" TEXT;
ALTER TABLE "Users" ADD COLUMN "role" TEXT;
ALTER TABLE "Users" ADD COLUMN "status" TEXT;

-- Set default values for existing records
UPDATE "Users" SET "password" = 'changeme123', "role" = 'Employee', "status" = 'Active', "createdAt" = NOW()::TEXT WHERE "password" IS NULL;

-- Now set the NOT NULL constraints and defaults for new records
ALTER TABLE "Users" ALTER COLUMN "password" SET NOT NULL;
ALTER TABLE "Users" ALTER COLUMN "role" SET NOT NULL, ALTER COLUMN "role" SET DEFAULT 'Employee';
ALTER TABLE "Users" ALTER COLUMN "status" SET NOT NULL, ALTER COLUMN "status" SET DEFAULT 'Active';
