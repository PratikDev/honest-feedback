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
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

	return (
		<Card className="p-6 *:px-0 first:pt-0">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
			<CardFooter>
				<p>Card Footer</p>
			</CardFooter>
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
