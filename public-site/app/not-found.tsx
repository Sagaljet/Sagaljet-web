import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import Navbar from "@/components/header";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none text-foreground/5 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-2">
                <div className="inline-block px-4 py-1.5 bg-muted rounded-full">
                  <p className="text-sm font-medium text-muted-foreground">
                    Error 404
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 -mt-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Let's
              get you back on track.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto bg-blue-400 ">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full hover:bg-blue-300 sm:w-auto bg-transparent"
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Need help finding something?
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Try searching or</span>
              <Link
                href="/contact"
                className="text-foreground hover:underline font-medium"
              >
                contact support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
