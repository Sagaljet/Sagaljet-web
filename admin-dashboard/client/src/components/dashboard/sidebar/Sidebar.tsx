import { Button } from "@/components/ui/button";
import { logout } from "@/redux/slices/auth/UserInfo";
import type { AppDispatch } from "@/redux/store";
import {
  ChevronDown,
  ChevronRight,
  FolderKanban,
  GalleryThumbnails,
  Globe,
  Layers2,
  LayoutPanelLeft,
  MessageSquareText,
  Package,
  Settings,
  ShoppingCart,
  User,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }: any) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // ============================================
  // MENU STRUCTURE - Two Main Sections
  // ============================================

  const menuSections = [
    {
      // ========== SITE SECTION ==========
      sectionName: "Site",
      sectionIcon: Globe,
      items: [
        {
          name: "Projects",
          icon: FolderKanban,
          link: "/project",
        },
        {
          name: "Categories",
          icon: LayoutPanelLeft,
          link: "/category",
        },
        {
          name: "Teams",
          icon: Users,
          link: "/team",
        },
        {
          name: "Clients",
          icon: UsersRound,
          link: "/client",
        },
        {
          name: "Banners",
          icon: GalleryThumbnails,
          link: "/banners",
        },
        {
          name: "Blogs",
          icon: MessageSquareText,
          link: "/blog",
        },
        {
          name: "Events",
          icon: MessageSquareText,
          link: "/event",
        },
        {
          name: "Users",
          icon: User,
          link: "/users",
        },
      ],
    },
    {
      // ========== E-COMMERCE SECTION ==========
      sectionName: "E-Commerce",
      sectionIcon: ShoppingCart,
      items: [
        {
          name: "Categories",
          icon: LayoutPanelLeft,
          link: "/products/categories",
        },
        {
          name: "Components",
          icon: Settings,
          link: "/products/components",
        },
        {
          name: "Options",
          icon: Layers2,
          link: "/products/options",
        },
        {
          name: "Products",
          icon: Package,
          link: "/products/list",
        },
        {
          name: "Design",
          icon: Package,
          link: "/order-designs",
        },
      ],
    },
  ];

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <img
          src="/logo.jpg"
          width={150}
          height={40}
          className="rounded-full"
          alt="skillUp logo"
        />
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="p-2 space-y-2">
          {menuSections.map((section) => (
            <div key={section.sectionName}>
              {/* Section Header (Collapsible) */}
              <button
                onClick={() => toggleSubmenu(section.sectionName)}
                className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <section.sectionIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-gray-900">
                    {section.sectionName}
                  </span>
                </div>
                {expandedMenu === section.sectionName ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* Section Items */}
              <ul
                className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                  expandedMenu === section.sectionName
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {section.items.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.link}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 p-2 pl-6 rounded-lg group hover:bg-blue-50 hover:text-blue-600 relative w-full transition-colors ${
                          isActive ? "bg-blue-50 text-blue-600" : ""
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active indicator */}
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r transition-opacity ${
                              isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          />
                          <item.icon
                            className={`w-5 h-5 transition-colors ${
                              isActive
                                ? "text-blue-600"
                                : "text-[#8B96AE] group-hover:text-blue-600"
                            }`}
                          />
                          <span
                            className={`transition-colors ${
                              isActive
                                ? "text-blue-600 font-medium"
                                : "text-[#8B96AE] group-hover:text-blue-600"
                            }`}
                          >
                            {item.name}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 mt-4">
          <Button
            className="w-full cursor-pointer"
            variant="destructive"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </nav>
    </div>
  );
}