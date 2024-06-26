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
import { Exception } from "@/errors/Expection";
import signUpSchema, { type signUpSchemaType } from "@/schemas/signUp.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

export default function Page() {
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [checkingUsername, setCheckingUsername] = useState(false);
	const [usernameMessage, setUsernameMessage] = useState("");
	const [debouncedUsername] = useDebounceValue(username, 500);

	const form = useForm<signUpSchemaType>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: signUpSchemaType) => {
		try {
			// if username is still being checked, return
			if (checkingUsername) return;

			// if username is not unique, show toast and return
			if (usernameMessage) {
				throw new Exception(usernameMessage);
			}

			const response = await axios.post<ApiResponse>("/api/auth/sign-up", data);
			toast.success("Success", {
				description: response.data.message,
			});
			router.push(`/verify/${data.username}`);
		} catch (error) {
			const title = "Signup failed";
			let description = "Error signing up";

			if (isAxiosError<ApiResponse>(error)) {
				description = error.response?.data?.message || description;
			} else if (error instanceof Exception) {
				description = error.message;
			}

			toast.error(title, {
				description,
			});
		}
	};

	useEffect(() => {
		const checkUsername = async () => {
			// if username is empty, return
			if (debouncedUsername.length <= 0) {
				setUsernameMessage("");
				return;
			}

			try {
				setCheckingUsername(true);
				setUsernameMessage("");
				const response = await axios.get<ApiResponse>(
					`/api/auth/check-username-unique?username=${debouncedUsername}`
				);
				response.data.success
					? setUsernameMessage("")
					: setUsernameMessage(response.data.message);
			} catch (error) {
				let message = "Error checking username";
				if (isAxiosError<ApiResponse>(error)) {
					message = error.response?.data?.message || message;
				}
				setUsernameMessage(message);
			} finally {
				setCheckingUsername(false);
			}
		};
		checkUsername();
	}, [debouncedUsername]);

	return (
		<div className="flex justify-center items-center min-h-screen bg-background">
			<div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-muted shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join HonestFeedback
					</h1>
					<p className="mb-3">
						Sign up to get feedback on your projects, and give feedback to
						others anonymously.
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
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-x-2">
											<span>Username</span>
											{checkingUsername && (
												<Loader2 className="w-4 h-4 animate-spin" />
											)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="username"
												onChange={(e) => {
													field.onChange(e);
													setUsername(e.target.value);
												}}
											/>
										</FormControl>
										<FormMessage>{usernameMessage}</FormMessage>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="example@domain.com"
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
							disabled={checkingUsername}
							className="w-full"
						>
							Sign Up
						</Button>
					</form>
				</Form>

				<div className="text-center mt-4">
					<p>
						Already a member?{" "}
						<Link
							href="/sign-in"
							className="text-blue-600 hover:underline"
						>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
