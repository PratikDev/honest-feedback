import dbConnect from "@/lib/dbConnect";
import { getEnv } from "@/lib/utils";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				identifier: {
					label: "Identifier",
					type: "text",
					placeholder: "Username or Email",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "*******",
				},
			},
			authorize: async (credentials) => {
				await dbConnect();

				const identifier = credentials?.identifier;
				const password = credentials?.password;

				if (!identifier || !password) {
					throw new Error("Invalid credentials");
				}

				try {
					const user = await UserModel.findOne({
						$or: [{ email: identifier }, { username: identifier }],
					});

					// if no user found
					if (!user) {
						throw new Error("No user found with the following credentials");
					}

					// if user is not verified
					if (!user.isVerified) {
						throw new Error("Please verify your account before login");
					}

					// if password is incorrect
					if (!(await bcrypt.compare(password, user.password))) {
						throw new Error("Incorrect credentials");
					}

					return {
						...user,
						id: user._id.toString(),
						_id: user._id.toString(),
					};
				} catch (error) {
					throw new Error((error as Error).message);
				}
			},
		}),
	],
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	secret: getEnv("NEXTAUTH_SECRET"),
	callbacks: {
		session: async ({ token, session }) => {
			if (token) {
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessages = token.isAcceptingMessages;
				session.user.username = token.username;
			}
			return session;
		},
		jwt: async ({ token, user }) => {
			if (user) {
				token._id = user._id;
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
				token.username = user.username;
			}
			return token;
		},
	},
};

export default authOptions;
