import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import { getExistingUserFromDB } from "../../utils/getExistingUserFromDB";
import { generateToken, jwtCookiePayload } from "../../utils/jwt";
import { hashPassword } from "../../utils/password";
import type { UserLoginPayload, UserRegisterPayload } from "./auth.validation";
import { makeNoise } from "../../utils/makeNoise";

const registerUserInDb = async (payload: UserRegisterPayload) => {
	const { email, name, password } = payload;

	const existingUserRecord = await getExistingUserFromDB({ email });

	if (existingUserRecord) {
		throw new AppError(409, "User already exists with this email");
	}

	const hashedPassword = await hashPassword(password);

	const result = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
		omit: { password: true },
	});

	const JwtPayload = await jwtCookiePayload(result);

	const accessToken = await generateToken(JwtPayload, {
		expiresIn: env.JWT_ACCESS_EXPIRES_IN,
		secret: env.JWT_ACCESS_SECRET,
	});

	const refreshToken = await generateToken(JwtPayload, {
		expiresIn: env.JWT_REFRESH_EXPIRES_IN,
		secret: env.JWT_REFRESH_SECRET,
	});

	makeNoise({
		entityId: JwtPayload.id,
		action: "USER_REGISTER",
		entityType: "USER",
		userId: JwtPayload.id,
	});

	return { accessToken, refreshToken };
};

const loginUser = async (payload: UserLoginPayload) => {
	const { email, password } = payload;

	const existingUserRecord = await getExistingUserFromDB({ email });

	if (!existingUserRecord) {
		throw new AppError(409, "User not exists with this email");
	}
	if (!existingUserRecord.password) {
		throw new AppError(409, "User not register with this password");
	}

	const validatePassword = await bcrypt.compare(
		password,
		existingUserRecord.password,
	);
	if (!validatePassword) {
		throw new AppError(409, "Password not match");
	}

	const JwtPayload = await jwtCookiePayload(existingUserRecord);

	const accessToken = await generateToken(JwtPayload, {
		expiresIn: env.JWT_ACCESS_EXPIRES_IN,
		secret: env.JWT_ACCESS_SECRET,
	});

	const refreshToken = await generateToken(JwtPayload, {
		expiresIn: env.JWT_REFRESH_EXPIRES_IN,
		secret: env.JWT_REFRESH_SECRET,
	});

	makeNoise({
		entityId: JwtPayload.id,
		action: "USER_LOGIN",
		entityType: "USER",
		userId: JwtPayload.id,
	});

	return { accessToken, refreshToken };
};

export const authService = {
	registerUserInDb,
	loginUser,
};
