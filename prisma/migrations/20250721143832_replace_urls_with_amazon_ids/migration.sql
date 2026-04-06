/*
  Warnings:

  - You are about to drop the column `audiobookUrl` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `ebookUrl` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `hardbackUrl` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `paperbackUrl` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "audiobookUrl",
DROP COLUMN "ebookUrl",
DROP COLUMN "hardbackUrl",
DROP COLUMN "paperbackUrl",
ADD COLUMN     "audiobookAsin" TEXT,
ADD COLUMN     "ebookAsin" TEXT,
ADD COLUMN     "hardbackIsbn" TEXT,
ADD COLUMN     "paperbackIsbn" TEXT;
