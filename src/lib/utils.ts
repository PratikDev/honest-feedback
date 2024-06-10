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