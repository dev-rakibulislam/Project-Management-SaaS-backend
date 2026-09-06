import type { User } from "../../generated/client";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { TJwtData, TJwtPayload } from "../types/jwtType";

export async function jwtCookiePayload(
	result: Pick<User, "id" | "email" | "platformRole" | "isActive">,
) {
	return {
		id: result.id,
		email: result.email,
		platformRole: result.platformRole,
		isActive: result.isActive,
	};
}



export const generateToken = async (payload: TJwtPayload, data: TJwtData) => {
	return jwt.sign(payload, data.secret, {
		expiresIn: data.expiresIn as SignOptions["expiresIn"],
	});
};

export const verifyToken = (token: string, secret: string) => {
	try {
		const verifiedToken = jwt.verify(token, secret) as TJwtPayload;
		return {
			success: true,
			data: verifiedToken,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
		};
	}
};