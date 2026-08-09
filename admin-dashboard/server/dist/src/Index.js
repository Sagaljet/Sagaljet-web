"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./routes/users/User"));
const teamRoutes_1 = __importDefault(require("./routes/teams/teamRoutes"));
const Project_1 = __importDefault(require("./routes/projects/Project"));
const category_1 = __importDefault(require("./routes/categories/category"));
const ClientRouter_1 = __importDefault(require("./routes/client/ClientRouter"));
const JobsRouter_1 = __importDefault(require("./routes/jobs/JobsRouter"));
const BlogRouter_1 = __importDefault(require("./routes/blog/BlogRouter"));
const Logo_1 = __importDefault(require("./routes/logo/Logo"));
const event_route_1 = __importDefault(require("./routes/event/event.route"));
const design_route_1 = __importDefault(require("./routes/design/design.route"));
const printing_route_1 = __importDefault(require("./routes/printing/printing.route"));
const category_design_route_1 = __importDefault(require("./routes/categories design/category-design.route"));
const order_route_1 = __importDefault(require("./routes/order/order.route"));
const banner_route_1 = __importDefault(require("./routes/banner/banner.route"));
const sideCardRoutes_1 = __importDefault(require("./routes/sideCard/sideCardRoutes"));
const orderDesign_routes_1 = __importDefault(require("./routes/order_design/orderDesign.routes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT;
app.use((0, cors_1.default)({
    origin: [
        "https://api.sagaljet.net/api",
        "https://www.sagaljet.net",
        "https://sagaljet.net",
        "http://localhost:3000",
        "http://localhost:5173",
        "https://sagaljet-alpha.vercel.app",
        "https://admin-sagaljet.vercel.app",
        "https://admin.sagaljet.net",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
//endPoints
app.use("/api/user", User_1.default);
app.use("/api/teams", teamRoutes_1.default);
app.use("/api/project", Project_1.default);
app.use("/api/event", event_route_1.default);
app.use("/api/categories/design", category_design_route_1.default);
app.use("/api/design", design_route_1.default);
app.use("/api/categories", category_1.default);
app.use("/api/client", ClientRouter_1.default);
app.use("/api/job", JobsRouter_1.default);
app.use("/api/blog", BlogRouter_1.default);
app.use("/api/logo", Logo_1.default);
app.use("/api", printing_route_1.default);
app.use("/api/order", order_route_1.default);
app.use("/api/banners", banner_route_1.default);
app.use("/api/side-cards", sideCardRoutes_1.default);
app.use("/api/order-designs", orderDesign_routes_1.default);
app.listen(port, () => console.log(`server running ${port}`));
