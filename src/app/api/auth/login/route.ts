import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signSessionToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import type { UserRole } from "@/types";

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Données invalides" },
        { status: 400 },
      );
    }
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase().trim() },
    });
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return NextResponse.json(
        { success: false, error: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }
    const token = await signSessionToken({
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
      name: user.name,
      memberId: user.memberId ?? undefined,
    });
    const res = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        memberId: user.memberId,
      },
    });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
