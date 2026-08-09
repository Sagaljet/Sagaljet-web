"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateLogoDialog from "./CreateLogoDialog";
import DeleteLogoDialog from "./DeleteLogoDialog";
import UpdateLogoDialog from "./UpdateLogoDialog";
import { getLogoFn } from "@/redux/slices/logo/GetLogo";
import { Palette, Calendar, FileImage } from "lucide-react";

export default function Logo() {
  const [screenSize, setScreenSize] = useState("large");
  const logos = useSelector((state) => state.getAllLogos);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLogoFn());
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("small");
      } else if (window.innerWidth < 1024) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const renderLogoCard = (logoItem) => (
    <Card key={logoItem.id} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Logo with background color */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center p-1"
                style={{ backgroundColor: logoItem.color || "#ffffff" }}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={logoItem.imageUrl || "/placeholder.svg"}
                    alt={logoItem.name}
                  />
                  <AvatarFallback className="text-xs">
                    {logoItem.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Color indicator */}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: logoItem.color || "#ffffff" }}
                title={`Background: ${logoItem.color || "#ffffff"}`}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{logoItem.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(logoItem.createAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <UpdateLogoDialog logos={logoItem} />
            <DeleteLogoDialog logos={logoItem.id} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {logoItem.description}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {/* Background Color */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Background Color:</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: logoItem.color || "#ffffff" }}
                />
                <Badge variant="outline" className="text-xs">
                  {logoItem.color || "#ffffff"}
                </Badge>
              </div>
            </div>

            {/* Category if available */}
            {logoItem.category && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Category:</span>
                <Badge variant="secondary">{logoItem.category.name}</Badge>
              </div>
            )}

            {/* ID */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ID:</span>
              <Badge variant="outline">{logoItem.id}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLogosTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Logo</TableHead>
              <TableHead className="hidden md:table-cell min-w-[250px]">
                Description
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Background Color
              </TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(logos?.data) && logos.data.length > 0 ? (
              logos.data.map((logoItem) => (
                <TableRow key={logoItem.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {/* Logo with background color */}
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center p-1"
                          style={{
                            backgroundColor: logoItem.color || "#ffffff",
                          }}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={logoItem.imageUrl || "/placeholder.svg"}
                              alt={logoItem.name}
                            />
                            <AvatarFallback className="text-xs">
                              {logoItem.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{logoItem.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          ID: {logoItem.id}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <div className="max-w-[250px]">
                      <p className="text-sm line-clamp-2">
                        {logoItem.description}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: logoItem.color || "#ffffff" }}
                      />
                      <span className="text-sm font-mono">
                        {logoItem.color || "#ffffff"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(logoItem.createAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <UpdateLogoDialog logos={logoItem} />
                      <DeleteLogoDialog logos={logoItem.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No logos found.</p>
                    <CreateLogoDialog />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Logo Management</h1>
            <p className="text-muted-foreground mt-1">
              {Array.isArray(logos?.data) ? logos.data.length : 0} logo(s) total
            </p>
          </div>
          <CreateLogoDialog />
        </div>

        {screenSize === "small" ? (
          <div className="space-y-4">
            {Array.isArray(logos?.data) && logos.data.length > 0 ? (
              logos.data.map(renderLogoCard)
            ) : (
              <div className="text-center py-8">
                <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No logos found.</p>
                <CreateLogoDialog />
              </div>
            )}
          </div>
        ) : (
          renderLogosTable()
        )}
      </div>
    </>
  );
}
