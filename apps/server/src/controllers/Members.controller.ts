import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "src/utils/prisma";

export const getAllMembers = async (req: Request, res: Response) => {
    const { search, page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { role: "SISWA" };
    if (search) {
        where.OR = [
            { nama: { contains: search as string, mode: "insensitive" } },
            { Username: { contains: search as string, mode: "insensitive" } },
        ]
    };

    const [member, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limitNum,
            select: { id: true, username: true, nama: true, kelas: true, role: true, createdAt: true },
            orderBy: { createdAt: "desc" }
        }),
        prisma.user.count({ where }),
    ]);

    res.json({
        success: true,
        message: "OK",
        data: {
            data: member, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum)
        }
    })
};

export const getMembersById = async (req: Request, res: Response) => {
    const user = prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
        select: { id: true, username: true, nama: true, kelas: true, role: true, createdAt: true }
    });

    if (!user) {
        res.status(404).json({ success: false, message: "Member not found" });
        return;
    };

    res.json({ success: true, message: "Member found!", data: user });
};

export const updateMembers = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { nama, kelas, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
        res.status(404).json({ success: false, message: "Member not found" });
        return;
    };

    const updateData: any = {};
    if (nama) updateData.nama = nama;
    if (kelas) updateData.kelas = kelas;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = prisma.user.update({
        where: { id },
        data: updateData,
        select: { id: true, username: true, nama: true, kelas: true, role: true, createdAt: true }
    });

    res.json({ success: true, message: "Member successfully update!", data: user });
};

export const deleteMembers = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
        res.status(404).json({ success: false, message: "Member not found" });
        return;
    };

    const user = prisma.user.delete({
        where: { id },
    });

    res.json({ success: true, message: "Member successfully deleted!", data: user });
};