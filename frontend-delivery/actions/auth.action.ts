"use server";

import { cookies } from "next/headers";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export const createAuthCookie = async () => {
  cookies().set("userAuth", "1", cookieOptions);
};

export const deleteAuthCookie = async () => {
  cookies().set("userAuth", "", { ...cookieOptions, maxAge: 0 });
};
