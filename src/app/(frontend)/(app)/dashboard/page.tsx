"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Exception } from "@/errors/Expection";
import { Message } from "@/models/User.model";
import acceptMessagesSchema, {
	AcceptMessagesSchemaType,
} from "@/schemas/acceptMessages.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

export default function Page() {
	const [_, copyFn] = useCopyToClipboard();

	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const { data: session } = useSession();
	const username = session?.user?.username;
	const profileUrl = `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/u/${username}`;

	const form = useForm<AcceptMessagesSchemaType>({
		resolver: zodResolver(acceptMessagesSchema),
		defaultValues: {
			acceptMessages: session?.user?.isAcceptingMessages || false,
		},
	});

	const fetchMessages = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await axios.get<ApiResponse>("/api/message");
			setMessages(response.data.messages || []);
		} catch (error) {
			const title = "Error";
			let description =
				"Error fetching messages. Please click the reload button to try again.";

			if (isAxiosError<ApiResponse>(error)) {
				description = error.response?.data?.message || description;
			} else if (error instanceof Exception) {
				description = error.message;
			}

			toast.error(title, {
				description,
			});
		} finally {
			setIsLoading(false);
		}
	}, [setMessages, setIsLoading]);

	const handleDeleteMessage = (message_id: string) => {
		setMessages((prevMessages) =>
			prevMessages.filter((message) => message.id !== message_id)
		);
	};

	const handleSwitchChange = async (checked: boolean) => {
		form.setValue("acceptMessages", checked);
		try {
			const response = await axios.post<ApiResponse>("/api/accept-messages", {
				acceptMessages: checked,
			});
			toast.success("Success", {
				description: response.data.message,
			});
		} catch (error) {
			const title = "Error";
			let description = "Error updating user accept messages status";

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

	const copyToClipboard = async () => {
		await copyFn(profileUrl);
		toast.success("Success", {
			description: "Link copied to clipboard.",
		});
	};

	useEffect(() => {
		if (!username) return;

		fetchMessages();
	}, [fetchMessages, username]);

	if (!session?.user) {
		return <>Please Login</>;
	}

	return (
		<div className="my-8 mx-auto p-6 bg-background rounded w-full max-w-6xl">
			<h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

			<div className="mb-4">
				<h2 className="text-lg font-semibold mb-2">
					Copy your unique link to share with others:
				</h2>

				<div className="flex items-center gap-x-2">
					<Input
						type="text"
						disabled
						value={profileUrl}
					/>
					<Button onClick={copyToClipboard}>Copy</Button>
				</div>
			</div>

			<div className="mb-4 flex items-center">
				<Switch
					{...form.register("acceptMessages")}
					checked={form.watch("acceptMessages")}
					onCheckedChange={handleSwitchChange}
				/>
				<span className="ml-2">
					Accept Messages: {form.watch("acceptMessages") ? "On" : "Off"}
				</span>
			</div>

			<Separator />

			<Button
				type="button"
				variant={`outline`}
				className="mt-4"
				onClick={fetchMessages}
			>
				{isLoading ? (
					<Loader2 className="animate-spin h-4 w-4" />
				) : (
					<RefreshCcw className="h-4 w-4" />
				)}
			</Button>

			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
				{messages.length > 0 ? (
					messages.map((message) => (
						<MessageCard
							message={message}
							onMessageDelete={handleDeleteMessage}
							key={message.id}
						/>
					))
				) : (
					<p>No Messages to display</p>
				)}
			</div>
		</div>
	);
}
