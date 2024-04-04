import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

const isAuthenticated = async (req: NextRequest) => {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (authHeader == null) return false;
  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  //   console.log(username, password);

  //   isValidPassword(password, "dalpatrathore");
  return (
    username === process.env.ADMIN_USERNAME &&
    (await isValidPassword(password, process.env.ADMIN_PASSWORD as string))
  );
};

export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

export const config = {
  matcher: "/admin/:path",
};
