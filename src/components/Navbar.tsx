"use client";

import { Github, XTwitter } from "@/components/brand-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogIn, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
	const { status } = useSession();

	return (
		<nav className="py-4 md:py-6 shadow-md">
			<div className="container mx-auto flex items-center justify-between">
				<Link
					className="text-xl font-bold"
					href={`/`}
				>
					<span className="hidden md:block">HonestFeedback</span>
					<span className="md:hidden">HF</span>
				</Link>

				<div className="flex items-center gap-x-1 md:gap-x-2">
					<Link
						href={`https://github.com/PratikDev/honest-feedback`}
						target="_blank"
						title="GitHub"
						className={cn(
							buttonVariants({ size: "sm", variant: "ghost" }),
							"p-2 h-auto"
						)}
					>
						<span className="sr-only">Github</span>
						<Github className="w-5 h-5" />
					</Link>
					<Link
						href={`https://x.com/pratik_and_dev`}
						target="_blank"
						title="X (formerly Twitter)"
						className={cn(
							buttonVariants({ size: "sm", variant: "ghost" }),
							"p-2 h-auto"
						)}
					>
						<span className="sr-only">X (formerly Twitter)</span>
						<XTwitter className="w-4 h-4" />
					</Link>
					<Link
						href={`/dashboard`}
						title="Dashboard"
						className={cn(
							buttonVariants({ size: "sm", variant: "ghost" }),
							"p-2 h-auto"
						)}
					>
						<span className="sr-only">Dashboard</span>
						<User className="w-4 h-4" />
					</Link>
					{status === "authenticated" ? (
						<Button
							type="button"
							size={"sm"}
							className="flex gap-x-1 items-center px-2 md:px-3 h-8 md:h-9"
							onClick={() => signOut()}
						>
							<span className="hidden md:block">Sign Out</span>
							<LogOut className="w-4 h-4" />
						</Button>
					) : (
						<Link
							href={`/sign-in`}
							className={cn(buttonVariants({ size: "sm" }), "space-x-1")}
						>
							<span>Sign In</span>
							<LogIn className="w-4 h-4" />
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
