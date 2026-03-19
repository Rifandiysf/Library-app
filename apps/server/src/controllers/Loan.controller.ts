import { Request, Response } from "express";
import { CreatePeminjamanRequest } from "@repo/types";
import prisma from "src/utils/prisma";

const loanInclude = {
    user: { select: { id: true, nama: true, username: true } },
    buku: { select: { id: true, judul: true, pengarang: true } },
}

export const getAllLoan = async (req: Request, res: Response) => {
    const { status, page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { role: "SISWA" };
    if (req.user!.role === "SISWA") where.userId = req.user!.id;
    if (status) where.status = status;

    const [loan, total] = await Promise.all([
        prisma.peminjaman.findMany({
            where,
            skip,
            take: limitNum,
            include: loanInclude,
            orderBy: { createdAt: "desc" }
        }),
        prisma.peminjaman.count({ where }),
    ]);

    res.json({
        success: true,
        message: "OK",
        data: {
            data: loan, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum)
        }
    });
};

export const createLoan = async (req: Request, res: Response) => {
    const { bukuId, tanggalKembali }: CreatePeminjamanRequest = req.body;
    const userId = req.user!.id;

    if (!bukuId || !tanggalKembali) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
    };

    //Book Stock Check
    const book = await prisma.buku.findUnique({ where: { id: bukuId } });
    if (!book) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    };
    if (book.stok <= 0) {
        res.status(404).json({ success: false, message: "Book stock is out of stock" });
        return;
    };

    //User already borrowed the same book
    const existingLoan = await prisma.peminjaman.findFirst({
        where: { userId, bukuId, status: "DIPINJAM" }
    });
    if (existingLoan) {
        res.status(400).json({ success: false, message: "Your already borrowed this book" });
        return;
    };

    //Created loan transaction
    const [loans] = await prisma.$transaction([
        prisma.peminjaman.create({
            data: { userId, bukuId, tanggalKembali: new Date(tanggalKembali) },
            include: loanInclude,
        }),
        prisma.buku.update({
            where: { id: bukuId },
            data: {
                stok: { decrement: 1 }
            }
        })
    ]);

    res.status(201).json({ success: true, message: "Loan successfully created", data: loans });
};

export const returnLoan = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const loan = await prisma.peminjaman.findUnique({ where: { id: id } });

    if (!loan) {
        res.status(404).json({ success: false, message: "Loan data not found" });
        return;
    };

    if (loan.status === "DIKEMBALIKAN") {
        res.status(400).json({ success: false, message: "Book already returned" });
        return;
    };

    //Students can only return their own property
    if (req.user!.role === "SISWA" && loan.userId !== req.user!.id) {
        res.status(403).json({ success: false, message: "Access denied" });
        return;
    };

    const currentDate = new Date();
    const isLate = currentDate > loan.tanggalKembali;

    const [updated] = await prisma.$transaction([
        prisma.peminjaman.update({
            where: { id },
            data: {
                status: isLate ? "TERLAMBAT" : "DIKEMBALIKAN",
                tanggalDikembalikan: currentDate,
            },
            include: loanInclude,
        }),
        prisma.buku.update({
            where: { id: loan.bukuId },
            data: {
                stok: { increment: 1 }
            }
        })
    ]);

    res.json({ success: true, message: "Book has been successfully returned", data: updated });
};