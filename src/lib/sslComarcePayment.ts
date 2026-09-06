import { env } from "../config/env";
import type { AuthenticatedUser } from "../types/auth";

export async function paymentWithSslcommerz(
	organization: { name: string },
	userData: AuthenticatedUser,
) {
	const transactionId = `TXN-${Date.now()}-${Math.random()
		.toString(36)
		.substring(2, 8)
		.toUpperCase()}`;

	const paymentData = new URLSearchParams({
		store_id: env.STORE_ID,
		store_passwd: env.STORE_PASSWD,
		total_amount: String(env.SSL_PRODUCT_AMOUNT),
		tran_id: transactionId,

		success_url: env.SUCCESS_URL,
		fail_url: env.FAIL_URL,
		cancel_url: env.FAIL_URL,
		// ipn_url: env.sslcommerz.ipnUrl ?? "",

		product_name: organization.name,
		product_category: "organization",
		product_profile: "general",

		cus_name: userData.name,
		cus_email: userData.email,

		cus_add1: "dhaka-1200",
		cus_city: "N/A",
		cus_country: "Bangladesh",
		cus_phone: "N/A",

		shipping_method: "NO",
		num_of_item: "1",
	});

	const response = await fetch(`${env.SANDBOX_API_URL}/gwprocess/v4/api.php`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: paymentData.toString(),
	});
	return { data: await response.json(), transactionId };
}

export async function paymentVerifySslcommerz(val_id: string) {
	const validationUrl =
		"https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php" +
		`?val_id=${val_id}` +
		`&store_id=${env.STORE_ID}` +
		`&store_passwd=${env.STORE_PASSWD}` +
		`&format=json`;

	const response = await fetch(validationUrl);
	return await response.json();
}

export const paymentStatusByTranId = async (tranId: string) => {
	const params = new URLSearchParams({
		tran_id: tranId,
		store_id: env.STORE_ID ?? "",
		store_passwd: env.STORE_PASSWD ?? "",
		format: "json",
	});

	const response = await fetch(
		`https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php?${params}`,
	);

	return response.json();
};
