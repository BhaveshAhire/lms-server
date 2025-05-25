require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from "express-rate-limit";

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["https://lms-client-beta-kohl.vercel.app/", "http://localhost:3000"],
  })
);
// app.use(
//   cors({
//     origin: "https://lmselearning.vercel.app",
//     //origin: "*",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "ACCESS_TOKEN",
//       "REFRESH_TOKEN",
//     ], // Allow headers
//     //exposedHeaders: ["ACCESS_TOKEN", "REFRESH_TOKEN"],
//   })
// );

// const allowedOrigins = ["https://lmselearning.vercel.app"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("ORIGIN", origin);
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: "GET, POST, PUT, DELETE",
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "x-access-token",
//       "x-refresh-token",
//     ],
//     credentials: true, // ✅ Important: Required for cookies & authentication
//   })
// );
// app.use((req, res, next) => {
//   // Set the Access-Control-Allow-Origin header (change '*' to your frontend's URL for security)
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://lmselearning.vercel.app"
//   ); // Or replace '*' with 'http://your-nextjs-app.com' for security

//   // Set other CORS headers if needed
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow these HTTP methods
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow these headers

//   // Handle OPTIONS preflight requests
//   if (req.method === "OPTIONS") {
//     res.status(200).end(); // Respond to OPTIONS preflight request
//   } else {
//     next();
//   }
// });

app.get("/debug-cors", (req, res) => {
  res.json({ message: "CORS test successful" });
});

// api request limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

//routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(limiter);

app.use(ErrorMiddleware);
