-- CreateEnum
CREATE TYPE "HomeworkStatus" AS ENUM ('PENDING', 'EXPIRED', 'PAUSED', 'DONE');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "student_id" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homeworks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "status" "HomeworkStatus" NOT NULL DEFAULT 'PENDING',
    "limit" TIMESTAMP(3),

    CONSTRAINT "Homeworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "id" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_names" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentSemester" (
    "id" SERIAL NOT NULL,
    "cicle" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "StudentSemester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectGrade" (
    "id" SERIAL NOT NULL,
    "subject_name" TEXT NOT NULL,
    "teacher_name" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,

    CONSTRAINT "SubjectGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_student_id_key" ON "Users"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Homeworks_id_key" ON "Homeworks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Homeworks_title_key" ON "Homeworks"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Students_id_key" ON "Students"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Students_curp_key" ON "Students"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "Students_email_key" ON "Students"("email");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSemester" ADD CONSTRAINT "StudentSemester_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "StudentSemester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
