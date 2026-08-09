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
import CreateComponentTypeDialog from "./CreateComponentTypeDialog";
import UpdateComponentTypeDialog from "./UpdateComponentTypeDialog";
import DeleteComponentTypeDialog from "./DeleteComponentTypeDialog";
import { getComponentTypesFn } from "@/redux/slices/component/getComponentTypes";

const ComponentTypes = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const componentTypes = useSelector(
    (state: RootState) => state.getComponentTypes
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchComponentTypes = async () => {
      setIsLoading(true);
      // @ts-ignore
      await dispatch(getComponentTypesFn());
      setIsLoading(false);
    };
    fetchComponentTypes();

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
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Options Count</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
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
          <h1 className="text-3xl font-bold">Component Types</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage component types like Size, Material, Finishing, etc.
          </p>
        </div>
        <CreateComponentTypeDialog />
      </div>

      {isMobile ? (
        <div className="space-y-4 px-4">
          {isLoading ? (
            [...Array(3)].map((_, index) => <SkeletonCard key={index} />)
          ) : Array.isArray(componentTypes.data) &&
            componentTypes.data.length > 0 ? (
            componentTypes.data.map((type: any) => (
              <Card key={type.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{type.name}</span>
                    <Badge variant="outline">
                      {type.options?.length || 0} options
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 pt-2 border-t">
                    <UpdateComponentTypeDialog componentType={type} />
                    <DeleteComponentTypeDialog
                      typeId={type.id}
                      typeName={type.name}
                      optionsCount={type.options?.length || 0}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No component types found.
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
                  <TableHead>Name</TableHead>
                  <TableHead>Options Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(componentTypes.data) &&
                componentTypes.data.length > 0 ? (
                  componentTypes.data.map((type: any) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {type.options?.length || 0} options
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <UpdateComponentTypeDialog componentType={type} />
                          <DeleteComponentTypeDialog
                            typeId={type.id}
                            typeName={type.name}
                            optionsCount={type.options?.length || 0}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10">
                      No component types found.
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

export default ComponentTypes;
