import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    //Admin Account
    const hashedPassword = await bcrypt.hash("admin123", 10)
    await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: hashedPassword,
            nama: "Administrator",
            role: "ADMIN"
        }
    })

    //Student Account
    const studentHashedPassword = await bcrypt.hash("budi123", 10)
    await prisma.user.upsert({
        where: {username: "budi"},
        update: {},
        create: {
            username: "budi",
            password: studentHashedPassword,
            nama: "Budi Pratama",
            kelas: "XII PPLG 1",
            role: "SISWA"
        }   
    })

    //Books
    const books = [
        {
            judul: "Malice - Catatan Pembunuhan Sang Novelis",
            pengarang: "Keigo Higashino",
            penerbit: "Gramedia Pustaka Utama",
            tahunTerbit: 2020,
            stok: 5,
            kategori: "Thriller"
        }, {
            judul: "Teka-Teki Gambar Aneh",
            pengarang: "Uketsu",
            penerbit: "Gramedia Pustaka Utama",
            tahunTerbit: 2026,
            stok: 5,
            kategori: "Misteri"
        }, {
            judul: "Home Sweet Loan",
            pengarang: "Almira Bastari",
            penerbit: "Gramedia Pustaka Utama",
            tahunTerbit: 2022,
            stok: 5,
            kategori: "Novel"
        }
    ]

    for (const book of books) {
        await prisma.buku.create({ data: book })
    }

    console.log("Seed Successfully!")
}

main().catch(console.error).finally(() => prisma.$disconnect())