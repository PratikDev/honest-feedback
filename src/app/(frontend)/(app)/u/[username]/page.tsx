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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import MESSAGES from "@/data/messages";
import { Exception } from "@/errors/Expection";
import messageSchema, { messageSchemaType } from "@/schemas/message.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Params = {
	params: { username: string };
};
export default function Page({ params: { username } }: Params) {
	const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

	const form = useForm<messageSchemaType>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: "",
			identifier: username,
		},
	});

	const onSubmit = async (data: messageSchemaType) => {
		try {
			const response = await axios.post<ApiResponse>("/api/message", data);
			toast.success("Success", {
				description: response.data.message,
			});
		} catch (error) {
			const title = "Error";
			let description = "Error sending message";

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

	const handleClick = (message: string) => {
		form.setValue("content", message);
	};

	useEffect(() => {
		function getRandomFourMessages(num: number) {
			return MESSAGES.sort(() => 0.5 - Math.random())
				.slice(0, num)
				.map((message) => message.content);
		}
		setSuggestedMessages(getRandomFourMessages(4));
	}, []);

	return (
		<div className="flex items-center max-w-4xl mx-auto w-full flex-grow py-8 flex-col gap-y-4 px-4">
			<p className="text-4xl font-bold">Send Your Message Here</p>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full space-y-4"
				>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Type your feedback..."
										rows={10}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						isLoading={form.formState.isSubmitting}
						type="submit"
					>
						Send
					</Button>
				</form>
			</Form>

			<div className="w-full last:w-full mt-8 space-y-2">
				<p>Or choose a message from below directly</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
					{suggestedMessages.length > 0
						? suggestedMessages.map((message, index) => (
								<div
									className="border rounded p-4 cursor-pointer hover:bg-muted transition-colors select-none"
									onClick={() => handleClick(message)}
									key={index}
								>
									{message}
								</div>
						  ))
						: Array.from({ length: 4 }).map((_, index) => (
								<Skeleton
									className="h-24"
									key={index}
								/>
						  ))}
				</div>
			</div>
		</div>
	);
}
