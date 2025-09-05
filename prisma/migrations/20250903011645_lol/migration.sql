-- CreateTable
CREATE TABLE "public"."StudentSemester" (
    "id" SERIAL NOT NULL,
    "cicle" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "StudentSemester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubjectGrade" (
    "id" SERIAL NOT NULL,
    "subject_name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,

    CONSTRAINT "SubjectGrade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."StudentSemester" ADD CONSTRAINT "StudentSemester_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubjectGrade" ADD CONSTRAINT "SubjectGrade_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "public"."StudentSemester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
