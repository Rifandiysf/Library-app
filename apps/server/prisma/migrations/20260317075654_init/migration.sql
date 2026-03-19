-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SISWA');

-- CreateEnum
CREATE TYPE "StatusPeminjaman" AS ENUM ('DIPINJAM', 'DIKEMBALIKAN', 'TERLAMBAT');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kelas" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SISWA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buku" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "pengarang" TEXT NOT NULL,
    "penerbit" TEXT NOT NULL,
    "tahunTerbit" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "kategori" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peminjaman" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bukuId" INTEGER NOT NULL,
    "tanggalPinjam" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalKembali" TIMESTAMP(3) NOT NULL,
    "tanggalDikembalikan" TIMESTAMP(3),
    "status" "StatusPeminjaman" NOT NULL DEFAULT 'DIPINJAM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peminjaman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "peminjaman" ADD CONSTRAINT "peminjaman_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peminjaman" ADD CONSTRAINT "peminjaman_bukuId_fkey" FOREIGN KEY ("bukuId") REFERENCES "buku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
