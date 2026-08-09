"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserFn } from "@/redux/slices/users/getUser";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDialogUser from "./CreateDialogUser";
import DeleteDialogUser from "./DeleteDialogUser";
import UpdateDialogUser from "./UpdateDialogUser";
import type { RootState } from "@/redux/store";

export default function User() {
  const [isMobile, setIsMobile] = useState(false);
  const user = useSelector((state: RootState) => state.getUser);
  const dispatch = useDispatch();

  useEffect(() => {
    //@ts-ignore
    dispatch(getUserFn());
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [dispatch]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <CreateDialogUser />
      </div>

      {isMobile ? (
        // Mobile Card View
        <div className="space-y-4 px-4">
          {Array.isArray(user.data) && user.data.length > 0 ? (
            user.data.map((userData) => (
              <Card key={userData.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={userData.avatarUrl || "/placeholder.svg"}
                          alt={userData.userName || userData.name}
                        />
                        <AvatarFallback>
                          {(userData.userName || userData.name)
                            ?.slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {userData.userName || userData.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {userData.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <UpdateDialogUser user={userData} />
                      <DeleteDialogUser user={userData.id} />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ID:</span>
                      <span>{userData.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="capitalize">{userData.role}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span>
                        {new Date(
                          userData.createdAt || userData.createAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found.</p>
            </div>
          )}
        </div>
      ) : (
        // Desktop Table View
        <div className="px-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">ID</TableHead>
                    <TableHead className="min-w-[200px]">User</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="w-[100px]">Role</TableHead>
                    <TableHead className="w-[120px]">Created At</TableHead>
                    <TableHead className="w-[120px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(user?.data) && user?.data?.length > 0 ? (
                    user?.data?.map((userData) => (
                      <TableRow key={userData.id}>
                        <TableCell className="font-medium">
                          {userData.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={userData.avatarUrl || "/placeholder.svg"}
                                alt={userData.userName || userData.name}
                              />
                              <AvatarFallback className="text-xs">
                                {(userData.userName || userData.name)
                                  ?.slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {userData.userName || userData.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{userData.email}</TableCell>
                        <TableCell>
                          <span className="capitalize">{userData.role}</span>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            userData.createdAt || userData.createAt
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <UpdateDialogUser user={userData} />
                            <DeleteDialogUser user={userData.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No users found.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
