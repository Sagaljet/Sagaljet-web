import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation(); // Get the current location
  const userInfo = useSelector((state) => state.userInfo);
  const user = userInfo?.role;

  const routes = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/service", label: "Services" },
    { href: "/project", label: "Project" },
    { href: "/blogs", label: "Blogs" },
  ];

  const handleLinkClick = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
    setIsOpen(false); // Close mobile menu if it's open
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          className="flex items-center space-x-2"
          to="/"
          onClick={handleLinkClick}
        >
          <img
            src="./skillup logo.svg"
            alt="SkillUp Logo"
            className="h-6 w-auto md:h-8"
          />
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center text-[#03234c93] space-x-4 lg:space-x-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={`transition-colors relative group ${
                location.pathname === route.href
                  ? "text-[#F91C2E]" // Active link color
                  : "hover:text-foreground/80"
              }`}
              onClick={handleLinkClick}
            >
              {route.label}
              <span
                className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
                  location.pathname === route.href
                    ? "w-full bg-[#F91C2E]" // Active link underline
                    : "w-0 group-hover:w-full bg-[#F91C2E]"
                }`}
              ></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <div className="flex items-center gap-3 lg:gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-1 sm:mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 flex flex-col">
              <Link
                className="flex items-center"
                to="/"
                onClick={handleLinkClick}
              >
                <img
                  src="./skillup logo.svg"
                  alt="SkillUp Logo"
                  className="h-6 w-auto md:h-8"
                />
              </Link>
              <nav className="mt-6 flex flex-col text-[#03234c93] space-y-3">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={`text-lg font-medium transition-colors relative group ${
                      location.pathname === route.href
                        ? "text-[#F91C2E]" // Active link color
                        : "hover:text-primary"
                    }`}
                    onClick={handleLinkClick}
                  >
                    {route.label}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
                        location.pathname === route.href
                          ? "w-full bg-[#F91C2E]" // Active link underline
                          : "w-0 group-hover:w-full bg-[#F91C2E]"
                      }`}
                    ></span>
                  </Link>
                ))}
              </nav>

              {/* Contact Button */}
              <Link to={"/contact"} onClick={handleLinkClick}>
                <Button className="hover:bg-[#D71727] duration-500 md:inline-flex bg-[#F91C2E] px-4 py-2 lg:px-5">
                  Contact
                </Button>
              </Link>
            </SheetContent>
          </Sheet>

          {/* Contact Button (only visible on larger screens) */}
          <Link to={"/contact"} onClick={handleLinkClick}>
            <Button className="hidden hover:bg-[#D71727] duration-500 md:inline-flex bg-[#F91C2E] px-4 py-2 lg:px-5">
              Contact
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
