import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * A function to get environment variables
 * @param name Name of the environment variable
 * @returns Value of the environment variable
 * @throws Throws "Missing environment variable ${name}" if the variable is not found
 */
export function getEnv(name: keyof EvnVariablesType) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing environment variable ${name}`);
	}
	return value;
}

export function isMoreThanOneHourPassed(dateObject: Date) {
	// Get the current time in milliseconds
	const currentTime = new Date().getTime();

	// Get the time from the date object in milliseconds
	const dateObjectTime = dateObject.getTime();

	// Calculate the difference in milliseconds
	const timeDifference = currentTime - dateObjectTime;

	// Convert milliseconds to hours (divide by 1000 for seconds, then 3600 for hours)
	const hoursPassed = timeDifference / (1000 * 3600);

	// Check if more than 1 hour has passed
	return hoursPassed > 1;
}
