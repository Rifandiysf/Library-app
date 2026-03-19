// ============ AUTH ============
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    nama: string;
    kelas?: string;
}

export interface AuthResponse {
    accessToken: string;
    user: UserPayload;
}

export interface UserPayload {
    id: number;
    username: string;
    nama: string;
    role: "ADMIN" | "SISWA";
}

// ============ BUKU ============
export interface Buku {
    id: number;
    judul: string;
    pengarang: string;
    penerbit: string;
    tahunTerbit: number;
    stok: number;
    kategori: string;
    createdAt: string;
}

export interface CreateBukuRequest {
    judul: string;
    pengarang: string;
    penerbit: string;
    tahunTerbit: number;
    stok: number;
    kategori: string;
}

export type UpdateBukuRequest = Partial<CreateBukuRequest>;

// ============ ANGGOTA ============
export interface Anggota {
    id: number;
    username: string;
    nama: string;
    kelas?: string;
    role: "ADMIN" | "SISWA";
    createdAt: string;
}

// ============ PEMINJAMAN ============
export type StatusPeminjaman = "DIPINJAM" | "DIKEMBALIKAN" | "TERLAMBAT";

export interface Peminjaman {
    id: number;
    userId: number;
    bukuId: number;
    tanggalPinjam: string;
    tanggalKembali: string;       // batas kembali
    tanggalDikembalikan?: string; // actual return
    status: StatusPeminjaman;
    user: Pick<Anggota, "id" | "nama" | "username">;
    buku: Pick<Buku, "id" | "judul" | "pengarang">;
}

export interface CreatePeminjamanRequest {
    bukuId: number;
    tanggalKembali: string; // ISO date string
}

// ============ API RESPONSE WRAPPER ============
export interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    data?: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}