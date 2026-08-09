import ComponentTypes from "@/components/component/ComponentTypes";
import ComponentOptions from "@/components/component/pages/ComponentOptions";
import BannersManagement from "@/pages/dashboard/banner/BannersManagement";
import Category from "@/pages/dashboard/categories/Category";
import Client from "@/pages/dashboard/clients/Client";
import DesignCategories from "@/pages/dashboard/designs/category/Category";
import Products from "@/pages/dashboard/designs/Product";
import Event from "@/pages/dashboard/events/Event";
import Main from "@/pages/dashboard/main/Main";
import OrderDesignPage from "@/pages/dashboard/order_design/OrderDesignPage";
import Printing from "@/pages/dashboard/printings/Printing";
import Team from "@/pages/dashboard/team/team";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import DashRouter from "../components/dashboard/dashRouter/DashRouter";
import AdminBlog from "../pages/dashboard/blog/AdminBlog";
import Project from "../pages/dashboard/projects/Projects";
import User from "../pages/dashboard/user/User";
import Homepage from "../pages/landingPage/home/Homepage";

// Main Layout with Navbar/Footer
const Router = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex ">
        <Outlet />
      </div>
    </div>
  );
};

export default Router;

export const router = createBrowserRouter([
  // Redirect /home to /
  {
    path: "/home",
    element: <Navigate to="/" />,
  },
  {
    path: "/",
    element: <DashRouter />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "main",
        element: <Main />,
      },
      {
        path: "project",
        element: <Project />,
      },
      {
        path: "team",
        element: <Team />,
      },
      // {
      //   path: "logos",
      //   element: <Logo />,
      // },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "users",
        element: <User />,
      },
      {
        path: "client",
        element: <Client />,
      },
      {
        path: "blog",
        element: <AdminBlog />,
      },
      {
        path: "event",
        element: <Event />,
      },
      {
        path: "banners",
        element: <BannersManagement />,
      },
      {
        path: "order-designs",
        element: <OrderDesignPage  />,
      },
     
      {
        path: "event",
        element: <Event />,
      },
      {
        path: "products",
        children: [
          {
            path: "categories",
            element: <DesignCategories />,
          },
          {
            path: "components",
            element: <ComponentTypes />,
          },
          {
            path: "Options",
            element: <ComponentOptions />,
          },
          {
            path: "list",
            element: <Products />,
          },
        ],
      },
      {
        path: "prints",
        element: <Printing />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Router />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
    ],
  },
]);
