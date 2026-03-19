import { Request, Response } from "express";
import { CreateBukuRequest, UpdateBukuRequest } from "@repo/types";
import prisma from "src/utils/prisma";

export const getAllBooks = async (req: Request, res: Response) => {
    const { search, kategori, page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
        where.OR = [
            { judul: { contains: search as string, mode: "insensitive" } },
            { pengarang: { contains: search as string, mode: "insensitive" } },
        ]
    };
    if (kategori) where.kategori = kategori;

    const [buku, total] = await Promise.all([
        prisma.buku.findMany({ where, skip, take: limitNum, orderBy: { createdAt: "desc" } }),
        prisma.buku.count({ where }),
    ]);

    res.json({
        success: true,
        message: "OK",
        data: {
            data: buku,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        }
    });
}

export const getBookById = async (req: Request, res: Response) => {
    const buku = prisma.buku.findUnique({ where: { id: parseInt(req.params.id) } });

    if (!buku) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    }

    res.json({
        success: true,
        message: "OK",
        data: buku
    });
}

export const createBooks = async (req: Request, res: Response) => {
    const body: CreateBukuRequest = req.body;

    if (!body.judul || !body.pengarang || !body.penerbit || !body.tahunTerbit || body.stok === undefined) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
    };

    const buku = await prisma.buku.create({ data: body });
    res.status(201).json({ success: true, message: "Books successfully added", data: buku });
}

export const updateBooks = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const body: UpdateBukuRequest = req.body;

    const existing = await prisma.buku.findUnique({ where: { id } });
    if (!existing) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    };

    const buku = await prisma.buku.update({ where: { id }, data: body });
    res.status(201).json({ success: true, message: "Book successfully update", data: buku });
}

export const deleteBooks = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const existing = await prisma.buku.findUnique({ where: { id } });
    if (!existing) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    };

    await prisma.buku.delete({ where: { id } });
    res.json({ success: true, message: "Book successfully delete" });
}