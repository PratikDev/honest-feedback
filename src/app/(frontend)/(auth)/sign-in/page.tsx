"use client";

import { buttonVariants } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
	const { data: session } = useSession();
	if (session) {
		return (
			<div className="p-3">
				Signed in as {session.user.email} <br />
				<button
					className={buttonVariants()}
					onClick={() => signOut()}
				>
					Sign out
				</button>
			</div>
		);
	}
	return (
		<div className="p-3">
			Not signed in <br />
			<button
				onClick={() => signIn()}
				className={buttonVariants()}
			>
				Sign in
			</button>
		</div>
	);
}
