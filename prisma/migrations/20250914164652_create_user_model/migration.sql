/*
  Warnings:

  - Added the required column `period` to the `SubjectGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_name` to the `SubjectGrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SubjectGrade" ADD COLUMN     "period" TEXT NOT NULL,
ADD COLUMN     "teacher_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "student_id" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_student_id_key" ON "public"."User"("student_id");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."Students"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
