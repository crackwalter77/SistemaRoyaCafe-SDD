-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'agronomist',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caficultor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "finca" TEXT NOT NULL,
    "ubicacion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Caficultor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostico" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "resultado" TEXT NOT NULL DEFAULT 'pendiente',
    "confianza" DOUBLE PRECISION,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notas" TEXT,
    "userId" INTEGER NOT NULL,
    "caficultorId" INTEGER NOT NULL,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Caficultor" ADD CONSTRAINT "Caficultor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_caficultorId_fkey" FOREIGN KEY ("caficultorId") REFERENCES "Caficultor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
