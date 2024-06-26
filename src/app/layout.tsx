import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/contexts/AuthProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Honest Feedback",
	description: "Give and receive honest feedbacks anonymously",
	metadataBase: new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`),
	openGraph: {
		title: "Honest Feedback",
		description: "Give and receive honest feedbacks anonymously",
		siteName: "HonestFeedback",
		url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
		authors: ["@pratikdev"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className={inter.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</body>
			</AuthProvider>
		</html>
	);
}
