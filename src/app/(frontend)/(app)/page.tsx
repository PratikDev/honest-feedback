"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import MESSAGES from "@/data/messages";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
	return (
		<>
			<main className="flex flex-grow flex-col gap-y-12 items-center justify-center px-4 md:px-24">
				<section className="text-center">
					<h1 className="text-4xl sm:text-5xl md:text-8xl font-bold">
						Dive into the world of anonymous feedbacks
					</h1>
					<p className="mt-3 md:mt-8 md:text-lg">
						Explore HonestFeedback - Where your feedback is shared anonymously
					</p>
				</section>

				<Carousel
					className="w-full max-w-lg md:max-w-2xl"
					plugins={[
						Autoplay({
							stopOnInteraction: false,
							stopOnMouseEnter: true,
						}),
					]}
				>
					<CarouselContent>
						{MESSAGES.map((message, index) => (
							<CarouselItem key={index}>
								<Card className="p-1">
									<CardContent className="flex flex-col gap-y-2 p-6 justify-center overflow-hidden">
										<span className="text-lg md:text-2xl font-semibold h-20 md:h-24 line-clamp-3 overflow-hidden">
											{message.content}
										</span>
										<small className="text-muted-foreground">
											{message.received}
										</small>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</main>

			<footer className="text-center p-4 md:p-6">
				© {new Date().getFullYear()} HonestFeedback. All rights reserved.
			</footer>
		</>
	);
}
