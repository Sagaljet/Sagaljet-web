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
import { Badge } from "@/components/ui/badge";
import type { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComponentOptionsFn } from "@/redux/slices/component/getComponentOptions.slice";
import { getComponentTypesFn } from "@/redux/slices/component/getComponentTypes";
import UpdateComponentOptionDialog from "./UpdateComponentOptionDialog";
import DeleteComponentOptionDialog from "./DeleteComponentOptionDialog";
import CreateComponentOptionDialog from "./CreateComponentOptionDialog";

const ComponentOptions = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const componentOptions = useSelector(
    (state: RootState) => state.getComponentOptions
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // @ts-ignore
      await dispatch(getComponentOptionsFn());
      // @ts-ignore
      await dispatch(getComponentTypesFn());
      setIsLoading(false);
    };
    fetchData();

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
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-16" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
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
        <div>
          <h1 className="text-3xl font-bold">Component Options</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage options for each component type (e.g., Small, Medium, Large for Size)
          </p>
        </div>
        <CreateComponentOptionDialog />
      </div>

      {isMobile ? (
        <div className="space-y-4 px-4">
          {isLoading ? (
            [...Array(3)].map((_, index) => <SkeletonCard key={index} />)
          ) : Array.isArray(componentOptions.data) &&
            componentOptions.data.length > 0 ? (
            componentOptions.data.map((option: any) => (
              <Card key={option.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{option.value}</span>
                    <Badge variant="secondary">{option.type?.name}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 pt-2 border-t">
                    <UpdateComponentOptionDialog componentOption={option} />
                    <DeleteComponentOptionDialog
                      optionId={option.id}
                      optionValue={option.value}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No component options found.
              </CardContent>
            </Card>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(componentOptions.data) &&
                componentOptions.data.length > 0 ? (
                  componentOptions.data.map((option: any) => (
                    <TableRow key={option.id}>
                      <TableCell>
                        <Badge variant="secondary">{option.type?.name}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {option.value}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <UpdateComponentOptionDialog componentOption={option} />
                          <DeleteComponentOptionDialog
                            optionId={option.id}
                            optionValue={option.value}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10">
                      No component options found.
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

export default ComponentOptions;