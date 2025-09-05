-- CreateTable
CREATE TABLE "public"."Students" (
    "id" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_names" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Students_id_key" ON "public"."Students"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Students_curp_key" ON "public"."Students"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "Students_email_key" ON "public"."Students"("email");
