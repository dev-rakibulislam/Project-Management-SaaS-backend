import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import seed from "./utils/seed";

const main = async () => {
	try {
		await prisma.$connect();
		console.log("Connected to the database successfully.");
		// seed();
		// console.log("seed to the database successfully.");
		app.listen(env.PORT, () => {
			console.log(`Server is running on port ${env.PORT}`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);
		await prisma.$disconnect();
		process.exit(1);
	}
};

main();
