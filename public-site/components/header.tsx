"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/lib/features/categories/categories-api";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, X, Mail, Phone, Headphones } from "lucide-react";
import { useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ProductSearch } from "./product-search";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const { data: categoriesData, isLoading } = useGetCategoriesQuery();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Designs", href: "/designs" },
    { name: "Events", href: "/events" },
    { name: "Blogs", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Header Bar */}
      <div className="w-full bg-[#132440] text-white">
        <div className="w-full px-3 sm:px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between py-2 gap-2 sm:gap-4">
            {/* Contact Information */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-xs sm:text-sm">
              {/* Email */}
              <a
                href="mailto:info@sagaljet.net"
                className="flex items-center gap-1.5 sm:gap-2 hover:text-blue-300 transition-colors duration-200"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>info@sagaljet.net</span>
              </a>

              {/* Divider - Hidden on mobile */}
              <span className="hidden md:block h-4 w-px bg-white/30" />

              {/* Call Center */}
              <a
                href="tel:3377"
                className="flex items-center gap-1.5 sm:gap-2 hover:text-blue-300 transition-colors duration-200"
              >
                <Headphones className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>
                  <span className="hidden sm:inline">Call Center: </span>
                  <span className="font-semibold">3377</span>
                </span>
              </a>

              {/* Divider - Hidden on mobile */}
              <span className="hidden md:block h-4 w-px bg-white/30" />

              {/* Telephone */}
              <a
                href="tel:+2522510099"
                className="flex items-center gap-1.5 sm:gap-2 hover:text-blue-300 transition-colors duration-200"
              >
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>
                  <span className="hidden sm:inline">Tel: </span>
                  +252 2 510099
                </span>
              </a>
            </div>

            {/* Right Side - Optional social links or additional info */}
            <div className="hidden lg:flex items-center gap-4 text-xs sm:text-sm">
              <span className="text-white/80">
                Welcome to Sagaljet - Your Trusted Partner
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-3 sm:px-4 md:px-6">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 min-w-fit"
            >
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={100}
                height={80}
                className=""
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-md ${
                    isActive(item.href)
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex flex-1 lg:flex-none items-center gap-2">
              {!isLoading && Array.isArray(categoriesData) && (
                <ProductSearch
                  placeholder="search a products"
                  onProductSelect={() => setIsOpen(false)}
                />
              )}
              <Link
                href="https://billboard.sagaljet.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button className="whitespace-nowrap text-xs sm:text-sm">
                  Book a Billboard/Tent
                </Button>
              </Link>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile & Tablet Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                    aria-label="Toggle navigation menu"
                  >
                    {isOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-full sm:w-80 px-4 sm:px-6 flex flex-col h-full pb-0"
                >
                  <VisuallyHidden.Root>
                    <SheetTitle>Mobile Menu</SheetTitle>
                    <SheetDescription>
                      Navigate through site pages and categories
                    </SheetDescription>
                  </VisuallyHidden.Root>

                  {/* Fixed Header Section (Search & Booking Button) */}
                  <div className="mt-6 mb-4 shrink-0 flex flex-col gap-2">
                    {!isLoading && Array.isArray(categoriesData) && (
                      <ProductSearch
                        placeholder="search a products"
                        onProductSelect={() => setIsOpen(false)}
                      />
                    )}
                    <Link
                      href="https://billboard.sagaljet.net/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full">Book a Billboard/Tent</Button>
                    </Link>
                  </div>

                  {/* Scrollable Content Area */}
                  <div className="flex-1 overflow-y-auto -mx-6 px-6 pb-6">
                    {/* Contact Info in Mobile Menu */}
                    <div className="bg-[#132440] rounded-lg p-4 mb-4">
                      <p className="text-xs font-semibold text-white/70 mb-3">
                        CONTACT US
                      </p>
                      <div className="flex flex-col gap-2.5 text-white text-sm">
                        <a
                          href="mailto:info@sagaljet.net"
                          className="flex items-center gap-2 hover:text-blue-300"
                        >
                          <Mail className="h-4 w-4" />
                          <span>info@sagaljet.net</span>
                        </a>
                        <a
                          href="tel:3377"
                          className="flex items-center gap-2 hover:text-blue-300"
                        >
                          <Headphones className="h-4 w-4" />
                          <span>Call Center: 3377</span>
                        </a>
                        <a
                          href="tel:+2522510099"
                          className="flex items-center gap-2 hover:text-blue-300"
                        >
                          <Phone className="h-4 w-4" />
                          <span>+252 2 510099</span>
                        </a>
                      </div>
                    </div>

                    {/* Mobile Menu Navigation */}
                    <nav className="flex flex-col gap-2 mt-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-4 px-2">
                        MAIN MENU
                      </p>
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`px-3 py-2.5 rounded-md text-sm sm:text-base font-medium transition-all duration-200 ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-muted text-foreground hover:text-primary"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile Categories Section */}
                    <div className="border-t border-border mt-6 pt-6">
                      <p className="text-xs font-semibold text-muted-foreground mb-4 px-2">
                        CATEGORIES
                      </p>

                      <nav className="flex flex-col gap-2">
                        <Link
                          href="/services"
                          onClick={() => setIsOpen(false)}
                          className={`px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                            pathname === "/services" &&
                            !searchParams.get("category")
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-muted text-foreground hover:text-primary"
                          }`}
                        >
                          All Products
                        </Link>
                        {!isLoading &&
                          Array.isArray(categoriesData) &&
                          categoriesData.map((category: any) => {
                            const categoryId = String(category.id);
                            const isActiveCategory =
                              searchParams.get("category") === categoryId;
                            return (
                              <Link
                                key={category.id}
                                href={`/services?category=${categoryId}`}
                                onClick={() => setIsOpen(false)}
                                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                  isActiveCategory
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "hover:bg-muted text-foreground hover:text-primary"
                                }`}
                              >
                                {category.name || category.title}
                              </Link>
                            );
                          })}
                      </nav>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Categories Bar */}
      <div className="hidden lg:block border-t border-border bg-background">
        <div className="w-full px-4 md:px-6">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            <Link
              href="/services"
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200 ${
                pathname === "/services" && !searchParams.get("category")
                  ? "text-primary font-semibold bg-primary/10"
                  : "text-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              All Products
            </Link>
            {!isLoading &&
              Array.isArray(categoriesData) &&
              categoriesData.map((category: any) => {
                const categoryId = String(category.id);
                const isActiveCategory =
                  searchParams.get("category") === categoryId;
                return (
                  <Link
                    key={category.id}
                    href={`/services?category=${categoryId}`}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200 ${
                      isActiveCategory
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    }`}
                  >
                    {category.name || category.title}
                  </Link>
                );
              })}
          </nav>
        </div>
      </div>
    </header>
  );
}
