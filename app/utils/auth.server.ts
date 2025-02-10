import { db } from "./db.server";
import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { loadEnvFile } from "process";

loadEnvFile();

const sessionSecret = process.env.SESSION_SECRET || "super-secret-key";

const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

// 🔐 Registrar usuario
export async function register(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.user.create({
    data: { name, email, password: hashedPassword, role: "USER" },
  });
}

// 🔑 Iniciar sesión
export async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

// 🛠 Crear sesión
export async function createUserSession(userId: number, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}

// 🔍 Obtener usuario desde la sesión
export async function getUserSession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  console.log({ session });
  const userId = session.get("userId");

  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
}

export async function getUser(name: string) {
  return db.user.findFirst({
    where: {
      name,
    },
  });
}

// 🚪 Cerrar sesión
export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}
