"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const express_rate_limit_1 = require("express-rate-limit");
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    credentials: true,
    origin: ["https://lmselearning.vercel.app", "http://localhost:3000"],
}));
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
exports.app.get("/debug-cors", (req, res) => {
    res.json({ message: "CORS test successful" });
});
// api request limit
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8",
    legacyHeaders: false,
});
//routes
exports.app.use("/api/v1", user_route_1.default, course_route_1.default, order_route_1.default, notification_route_1.default, analytics_route_1.default, layout_route_1.default);
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(limiter);
exports.app.use(error_1.ErrorMiddleware);
