/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."HomeworkStatus" AS ENUM ('PENDING', 'EXPIRED', 'PAUSED', 'DONE');

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_student_id_fkey";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "student_id" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Homeworks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "public"."HomeworkStatus" NOT NULL DEFAULT 'PENDING',
    "limit" TIMESTAMP(3),

    CONSTRAINT "Homeworks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "public"."Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_student_id_key" ON "public"."Users"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Homeworks_id_key" ON "public"."Homeworks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Homeworks_title_key" ON "public"."Homeworks"("title");

-- AddForeignKey
ALTER TABLE "public"."Users" ADD CONSTRAINT "Users_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."Students"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
