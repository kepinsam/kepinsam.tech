"use server";
import "@/lib/server-only";

import { getServerSession, type Session } from "next-auth";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { authOptions } from "../app/api/auth/[...nextauth]/authOptions";
import { db } from "@/db";
import { createId } from "@paralleldrive/cuid2";
import { guestbook } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

async function getSession(): Promise<Session> {
	const session = (await getServerSession(authOptions)) as Session;
	if (!session || !session.user) {
		throw new Error("Unauthorized");
	}
	return session;
}

export async function insertGuestbookEntry(formData: FormData) {
	const session = await getSession();
	const email = session.user?.email as string;
	const name = session.user?.name as string;
	const image = session.user?.image as string;
	const created_by = session.user?.name as string;

	if (!session.user) {
		throw new Error("Unauthorized");
	}

	const urlId = createId();
	const entry = formData.get("entry")?.toString() ?? "";
	const body = entry.slice(0, 500);

	await db.insert(guestbook).values({
		id: urlId,
		email: email,
		body: body,
		created_by: created_by,
		created_at: sql`CURRENT_TIMESTAMP`,
	});

	revalidatePath("/guestbook");

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "cevinsam11@gmail.com",
			pass: process.env.GOOGLE_APP_PASSWORD,
		},
	});

	const mailOptions = {
		from: "cevinsam11@gmail.com",
		to: "cevin.samuel@yahoo.com",
		subject: "New Guestbook Entry",
		html: `<p>Email: '${email}'</p><p>Name: '${name}'</p><p>Profile image URL: '${image}'</p><p>Message: '${body}'</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			throw new Error(error.message);
		}
		console.log("Email sent", info.response);
	});
}

export async function deleteOwnGuestbookEntries(id: string) {
	try {
		await db.delete(guestbook).where(eq(guestbook.id, id));
	} catch (error) {
		console.error("Error in deleteOwnGuestbookEntries: ", error);
	}
	revalidatePath("/guestbook");
}
