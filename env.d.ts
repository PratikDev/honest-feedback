declare global {
	namespace NodeJS {
		interface ProcessEnv extends EvnVariablesType {}
	}
}

export {};
