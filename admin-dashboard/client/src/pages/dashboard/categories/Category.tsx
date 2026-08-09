import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategoryFn } from "@/redux/slices/category/GetCategory";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDialogCategory from "./CreateCategoryDialog";
import DeleteDialogCategory from "./DeleteDialogCategory";
import UpdateDialogCategory from "./UpdateDialogCategory";
import type { RootState } from "@/redux/store";

const Category = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const category = useSelector((state: RootState) => state.getCategory);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      //@ts-ignore
      await dispatch(getCategoryFn());
      setIsLoading(false);
    };

    fetchCategories();

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [dispatch]);

  const SkeletonCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-3xl font-bold">Category</h1>
        <CreateDialogCategory />
      </div>
      {isMobile ? (
        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, index) => <SkeletonCard key={index} />)
          ) : Array.isArray(category.data) && category.data.length > 0 ? (
            category.data.map((categoryItem:any) => (
              <Card key={categoryItem.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage
                          src={categoryItem.logoUrl}
                          alt={categoryItem.name}
                        />
                        <AvatarFallback>
                          {categoryItem.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{categoryItem.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <UpdateDialogCategory category={categoryItem} />
                      <DeleteDialogCategory category={categoryItem.id} />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {categoryItem.description}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>ID: {categoryItem.id}</span>
                    <span>
                      Created:{" "}
                      {new Date(categoryItem.createAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {isLoading ? (
            <SkeletonTable />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(category.data) && category.data.length > 0 ? (
                  category.data.map((categoryItem:any) => (
                    <TableRow key={categoryItem.id}>
                      <TableCell className="font-medium">
                        {categoryItem.id}
                      </TableCell>
                      <TableCell>{categoryItem.name}</TableCell>
                      <TableCell>{categoryItem.description}</TableCell>
                      <TableCell>
                        {new Date(categoryItem.createAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <UpdateDialogCategory category={categoryItem} />
                          <DeleteDialogCategory category={categoryItem.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default Category;
