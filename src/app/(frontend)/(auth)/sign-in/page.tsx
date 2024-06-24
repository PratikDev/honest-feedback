"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import signInSchema, { signInSchemaType } from "@/schemas/signIn.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
	const router = useRouter();

	const form = useForm<signInSchemaType>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const onSubmit = async (data: signInSchemaType) => {
		const result = await signIn("credentials", {
			...data,
			redirect: false,
		});

		if (result?.error) {
			toast.error("Error", {
				description: result.error,
			});
			return;
		}

		router.push("/dashboard");
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-background">
			<div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-muted shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join HonestFeedback
					</h1>
					<p className="mb-3">
						Sign in to your account and start sharing your feedback
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<div className="space-y-5">
							<FormField
								control={form.control}
								name="identifier"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username or Email</FormLabel>
										<FormControl>
											<Input
												placeholder="Username or Email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="********"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button
							type="submit"
							isLoading={form.formState.isSubmitting}
							className="w-full"
						>
							Sign In
						</Button>
					</form>
				</Form>

				<div className="text-center mt-4">
					<p>
						Don't have an account yet?{" "}
						<Link
							href="/sign-up"
							className="text-blue-600 hover:underline"
						>
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
