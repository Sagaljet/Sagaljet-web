/*
  Warnings:

  - Added the required column `client` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project" ADD COLUMN     "client" TEXT NOT NULL,
ADD COLUMN     "link" TEXT,
ALTER COLUMN "categoryId" DROP DEFAULT;
