import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";

export const { auth, handlers, signIn, signOut } = NextAuth({
	providers: [
		Discord({
			clientId: process.env.DISCORD_CLIENT_ID ?? "",
			clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
		}),
		GitHub({
			clientId: process.env.GITHUB_ID ?? "",
			clientSecret: process.env.GITHUB_SECRET ?? "",
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
			// httpOptions: {
			// 	timeout: 1000 * 30, // 30 seconds
			// },
		}),
	],
	secret: process.env.NEXTAUTH_SECRET ?? "",
	trustHost: true,
	// events: {signIn}
	// callbacks: {
	// 	redirect({ url, baseUrl }) {
	// 		// Allows relative callback URLs
	// 		if (url.startsWith("/")) return `${baseUrl}${url}`;

	// 		// Allows callback URLs on the same origin
	// 		if (new URL(url).origin === baseUrl) return url;

	// 		return baseUrl;
	// 	},
	// },
});

export { auth as middleware } from "@/server/auth";
