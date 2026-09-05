import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import { authRouter } from "./modules/auth/auth.route";
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
// app.use(express.json());
// app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

// Basic route
app.get("/", async (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "Welcome here",
	});
});

// app.use(globalErrorHandler);
// app.use(notFound);
