"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
	const { data: session, status } = useSession();

	return (
		<nav className="p-4 md:p-6 shadow-md">
			<div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
				<Link
					className="text-xl font-bold mb-4 md:mb-0"
					href={`/`}
				>
					HonestFeedback
				</Link>
				{status === "authenticated" ? (
					<>
						<span className="mr-4">Welcome {session.user.username}</span>
						<Button
							className="w-full md:w-auto"
							type="button"
							onClick={() => signOut()}
						>
							Sign Out
						</Button>
					</>
				) : (
					<Link
						href={`/sign-in`}
						className="w-full md:w-auto"
					>
						Sign In
					</Link>
				)}
			</div>
		</nav>
	);
}
