import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/", "/sign-in", "/sign-up", "/verify"];
const PROTECTED_ROUTES = ["/dashboard"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const pathname = request.nextUrl.pathname;

	const isAuthRoute = AUTH_ROUTES.find((route) => pathname.startsWith(route));
	if (token && isAuthRoute) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	const isProtectedRoute = PROTECTED_ROUTES.find((route) =>
		pathname.startsWith(route)
	);
	if (!token && isProtectedRoute) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/", "/sign-in", "/sign-up", "/dashboard/:path*", "/verify/:path*"],
};

export { default } from "next-auth/middleware";
