import {
	PaymentProvider,
	PaymentStatus,
	SubscriptionStatus,
} from "../../../generated/enums";
import { env } from "../../config/env";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import {
	paymentVerifySslcommerz,
	paymentWithSslcommerz,
} from "../../lib/sslComarcePayment";
import type { AuthenticatedUser } from "../../types/auth";
import type { CreatePaymentPayload } from "./payment.validation";

const createPaymentService = async (
	payload: CreatePaymentPayload,
	userData: AuthenticatedUser,
) => {
	const organization = await prisma.organization.findUnique({
		where: {
			id: payload.organizationId,
		},
		include: {
			subscriptions: true,
			owner: true,
		},
	});

	if (!organization) {
		throw new AppError(404, "Organization not found");
	}

	// Only organization owner can create payment
	if (organization.ownerId !== userData.id) {
		throw new AppError(403, "You are not the owner of this organization");
	}

	let subscription = organization.subscriptions[0];

	if (!subscription) {
		subscription = await prisma.subscription.create({
			data: {
				organizationId: organization.id,
				status: SubscriptionStatus.PENDING,
			},
		});
	}

	if (subscription.status === SubscriptionStatus.ACTIVE) {
		throw new AppError(
			400,
			"This organization already has an active subscription",
		);
	}

	// Check existing payment
	const existingPayment = await prisma.payment.findFirst({
		where: {
			subscriptionId: subscription.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	// Create SSLCommerz payment session
	const sslResponse = await paymentWithSslcommerz(
		{ name: organization.name },
		userData,
	);

	if (!sslResponse.data?.status || sslResponse.data.status !== "SUCCESS") {
		throw new AppError(400, "Failed to initialize payment");
	}

	if (existingPayment?.status === PaymentStatus.PENDING) {
		const payment = await prisma.payment.update({
			where: {
				id: existingPayment.id,
			},
			data: {
				transactionId: sslResponse.transactionId,
				amount: 1000, //?hard code for only 1 time payment
				currency: "BDT",
				provider: PaymentProvider.SSLCOMMERZ,
				status: PaymentStatus.PENDING,
			},
		});

		return {
			message: "Payment is pending. You can complete the payment now",
			transactionId: payment.transactionId,
			paymentUrl: sslResponse.data.GatewayPageURL,
		};
	}

	const payment = await prisma.payment.create({
		data: {
			subscriptionId: subscription.id,
			transactionId: sslResponse.transactionId,
			amount: env.SSL_PRODUCT_AMOUNT,
			currency: env.CURRENCY,
			provider: PaymentProvider.SSLCOMMERZ,
			status: PaymentStatus.PENDING,
		},
	});

	return {
		message: "Payment initialized successfully",
		transactionId: payment.transactionId,
		paymentUrl: sslResponse.data.GatewayPageURL,
	};
};

const verifyPaymentService = async (tran_id: string, val_id: string) => {
	if (!tran_id || !val_id) {
		throw new AppError(400, "Invalid payment data");
	}
	const payment = await prisma.payment.findUnique({
		where: {
			transactionId: tran_id,
		},
		include: { subscription: true },
	});

	if (!payment) {
		throw new AppError(404, "Payment not found");
	}
	const data = await paymentVerifySslcommerz(val_id);

	if (data.status !== "VALID") {
		throw new AppError(400, "Invalid payment");
	}
	if (data.tran_id !== payment.transactionId) {
		throw new AppError(400, "Transaction mismatch");
	}
	if (Number(data.amount) !== Number(payment.amount)) {
		throw new AppError(400, "Payment amount mismatch");
	}

	const {
		risk_level,
		card_brand,
		card_issuer,
		card_type,
		card_category,
		currency_type,
	} = data;

	const transaction = await prisma.$transaction(async (tx) => {
		await tx.payment.update({
			where: {
				id: payment.id,
			},
			data: {
				status: PaymentStatus.SUCCESS,
				paidAt: new Date(),
				currency: currency_type,
				cardBrand: card_brand,
				cardType: card_type,
				riskLevel: risk_level,
				cardCategory: card_category,
				cardIssuer: card_issuer,
				
			},
		});

		await tx.subscription.update({
			where: {
				id: payment.subscriptionId,
			},
			data: {
				status: SubscriptionStatus.ACTIVE,
			},
		});
		return {
			paymentStatus: PaymentStatus.SUCCESS,
			SubscriptionStatus: SubscriptionStatus.ACTIVE,
		};
	});
	return transaction;
};

// const failPaymentService = async (payload: any) => {
// 	const { tran_id } = payload;

// 	if (!tran_id) {
// 		throw new AppError(400, "Transaction ID is required");
// 	}

// 	const payment = await prisma.payment.findUnique({
// 		where: {
// 			transactionId: tran_id,
// 		},
// 	});
// 	if (!payment) {
// 		throw new AppError(404, "Payment not found");
// 	}
// 	if (payment.status === PaymentStatus.PAID) {
// 		return {
// 			message: "Payment is already completed",
// 			paymentStatus: payment.status,
// 		};
// 	}

// 	const sslResponse = await paymentStatusByTranId(payment.transactionId);

// 	if (
// 		!sslResponse.element ||
// 		!Array.isArray(sslResponse.element) ||
// 		sslResponse.element.length === 0
// 	) {
// 		throw new AppError(404, "Transaction not found in SSLCommerz");
// 	}

// 	const transactions = sslResponse.element.filter(
// 		(item: any) => item.tran_id === payment.transactionId,
// 	);

// 	if (transactions.length === 0) {
// 		throw new AppError(400, "Transaction ID mismatch");
// 	}

// 	const latestTransaction = transactions.at(-1);

// 	if (latestTransaction.status !== "FAILED") {
// 		throw new AppError(
// 			400,
// 			`Payment is not failed. Current status: ${latestTransaction.status}`,
// 		);
// 	}

// 	if (Number(latestTransaction.amount) !== Number(payment.amount)) {
// 		throw new AppError(400, "Payment amount mismatch");
// 	}

// 	const updatedPayment = await prisma.payment.update({
// 		where: {
// 			id: payment.id,
// 		},
// 		data: {
// 			status: PaymentStatus.FAILED,
// 		},
// 	});

// 	return {
// 		message: "Payment marked as failed",
// 		paymentStatus: updatedPayment.status,
// 		transactionId: updatedPayment.transactionId,
// 	};
// };

// const getSinglePaymentService = async (id: string) => {
// 	const data = await prisma.payment.findUnique({ where: { id } });
// 	if (!data) {
// 		return { message: "payment not found", data: null };
// 	}
// 	return { message: "payment found successfully", data };
// };

// const getMyPaymentService = async (id: string) => {
// 	const data = await prisma.payment.findMany({ where: { id } });

// 	if (!data) {
// 		return { message: "payment not found", data: null };
// 	}
// 	return { message: "payment found successfully", data };
// };

export const paymentService = {
	createPaymentService,
	// failPaymentService,
	verifyPaymentService,
	// getSinglePaymentService,
	// getMyPaymentService,
};
