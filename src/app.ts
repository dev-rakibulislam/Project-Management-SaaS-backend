import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./error/globalErrorHandler";
import { organizationsRouter } from "./modules/organizations/organizations.route";
import { paymentRouter } from "./modules/payment/payment.route";
export const app: Application = express();

// app.use(
// 	cors({
// 		origin: config.frontend_url,
// 		credentials: true,
// 	}),
// );

// Enable URL-encoded form data parsing
// app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
// app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/organization", organizationsRouter);
app.use("/api/v1/payment", paymentRouter);

// Basic route
app.get("/", async (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "Welcome here",
	});
});

app.use(globalErrorHandler);
// app.use(notFound);
