"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Exception } from "@/errors/Expection";
import { cn } from "@/lib/utils";
import { type Message } from "@/models/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { buttonVariants } from "./ui/button";

type Props = {
	message: Message;
	onMessageDelete: (message_id: string) => void;
};
export default function MessageCard({ message, onMessageDelete }: Props) {
	const handleDelete = async () => {
		try {
			const response = await axios.delete(`/api/message`, {
				data: {
					messageId: message._id,
				},
			});
			toast.success("Success", {
				description: response.data.message,
			});
			onMessageDelete(message._id as string);
		} catch (error) {
			const title = "Error";
			let description = "Error deleting the message. Please try again later.";

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

	const formattedDate = (date: string | Date) => {
		const dateObj = new Date(date);
		return dateObj.toLocaleString("en", {
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	};

	return (
		<Card className="p-6">
			<CardContent className="flex flex-col px-0 gap-y-2 justify-center">
				<span className="text-lg font-semibold">{message.content}</span>
				<small className="text-muted-foreground">
					{formattedDate(message.createdAt)}
				</small>
			</CardContent>

			<AlertDialog>
				<AlertDialogTrigger
					className={cn(buttonVariants({ variant: "outline" }), "w-full")}
				>
					Delete
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							message.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}
