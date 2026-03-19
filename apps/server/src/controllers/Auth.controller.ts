import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import { signToken } from "../utils/jwt";
import { LoginRequest, RegisterRequest } from "@repo/types";

export const login = async (req: Request, res: Response) => {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
        res.status(400).json({ success: false, message: "Username and Password has required" });
        return;
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        res.status(400).json({ success: false, message: "Username or Password invalid" });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!password) {
        res.status(400).json({ success: false, message: "Username or Password invalid" });
        return;
    }

    const payload = { id: user.id, username: user.username, nama: user.nama, role: user.role as "ADMIN" | "SISWA" };
    const token = signToken(payload);

    res.status(200).json({
        success: true,
        message: "Login Successfully!",
        data: { accessToken: token, user: payload }
    });
};

export const register = async (req: Request, res: Response) => {
    const { nama, username, kelas, password }: RegisterRequest = req.body;

    if (!username || !password || !nama || !kelas) {
        res.status(400).json({ success: false, message: "name, Username, Class and Password has required" });
        return;
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        res.status(409).json({ success: false, message: "Username already in use" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { username, password: hashedPassword, nama, kelas, role: "SISWA" }
    })

    const payload = { id: user.id, username: user.username, nama: user.nama, role: user.role as "ADMIN" | "SISWA" };
    const token = signToken(payload);

    res.status(201).json({
        success: true,
        message: "Register Successfully!",
        data: { accessToken: token, user: payload }
    });
}

export const getProfile = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {id: req.user!.id},
        select: {id: true, nama: true, username: true, kelas: true, role: true, createdAt: true},
    })

    res.json({ success: true, message: "Ok", data: user });
}