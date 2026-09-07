import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";
import AppError from "../error/appError";

const googleClient = new OAuth2Client(env.GOOGL_CLIENT_ID);

export const verifyGoogleToken = async (credential: string) => {
	const ticket = await googleClient.verifyIdToken({
		idToken: credential,
		audience: env.GOOGL_CLIENT_ID,
	});

	const payload = ticket.getPayload();

	if (!payload?.email) {
		throw new AppError(400, "Google account email not found.");
	}

	return {
		googleId: payload.sub,
		email: payload.email,
		name: payload.name || "Google User",
	};
};
