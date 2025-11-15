-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kid" (
    "id" SERIAL NOT NULL,
    "nameKids" TEXT NOT NULL,
    "nameParents" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" INTEGER NOT NULL,
    "atipica" BOOLEAN NOT NULL,
    "restricao" BOOLEAN NOT NULL,
    "alergia" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Kid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "kidId" INTEGER NOT NULL,
    "classDate" TIMESTAMP(3) NOT NULL,
    "qrCodeId" INTEGER NOT NULL,
    "timestampEntrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timestampSaida" TIMESTAMP(3),

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_classDate_qrCodeId_key" ON "Attendance"("classDate", "qrCodeId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "Kid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
