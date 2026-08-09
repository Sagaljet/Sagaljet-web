import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import user from "./routes/users/User";
import teamRoutes from "./routes/teams/teamRoutes";
import project from "./routes/projects/Project";
import category from "./routes/categories/category";
import client from "./routes/client/ClientRouter";
import job from "./routes/jobs/JobsRouter";
import blog from "./routes/blog/BlogRouter";
import logo from "./routes/logo/Logo";
import event from "./routes/event/event.route";
import design from "./routes/design/design.route";
import printingRoutes from "./routes/printing/printing.route";
import categoryDesign from "./routes/categories design/category-design.route";
import order from "./routes/order/order.route";
import banner from "./routes/banner/banner.route";
import sidecard from "./routes/sideCard/sideCardRoutes";
import orderDesignRoutes from "./routes/order_design/orderDesign.routes";

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(
  cors({
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
  }),
);
app.use(express.json());

//endPoints

app.use("/api/user", user);
app.use("/api/teams", teamRoutes);
app.use("/api/project", project);
app.use("/api/event", event);
app.use("/api/categories/design", categoryDesign);
app.use("/api/design", design);
app.use("/api/categories", category);
app.use("/api/client", client);
app.use("/api/job", job);
app.use("/api/blog", blog);
app.use("/api/logo", logo);
app.use("/api", printingRoutes);
app.use("/api/order", order);
app.use("/api/banners", banner);
app.use("/api/side-cards", sidecard);
app.use("/api/order-designs", orderDesignRoutes);

app.listen(port, () => console.log(`server running ${port}`));
