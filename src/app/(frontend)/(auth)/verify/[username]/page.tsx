"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Exception } from "@/errors/Expection";
import verifySchema, { verifySchemaType } from "@/schemas/verify.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Params = {
	params: { username: string };
};
export default function Page({ params: { username } }: Params) {
	const router = useRouter();
	const form = useForm<verifySchemaType>({
		resolver: zodResolver(verifySchema),
		defaultValues: {
			verifyCode: "",
		},
	});

	const onSubmit = async (data: verifySchemaType) => {
		try {
			const response = await axios.post<ApiResponse>("/api/auth/verify-code", {
				...data,
				identifier: username,
			});
			toast.success("Success", {
				description: response.data.message,
			});
			router.push("/sign-in");
		} catch (error) {
			const title = "Verification failed";
			let description = "Error verifying code";

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

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Verify your account
					</h1>
					<p className="mb-3">
						Verify your account to continue using our services.
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="verifyCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>One-Time Password</FormLabel>
									<FormControl>
										<InputOTP
											maxLength={6}
											{...field}
										>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormDescription>
										Please enter the one-time password sent to your email.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							isLoading={form.formState.isSubmitting}
							className="w-full"
						>
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
