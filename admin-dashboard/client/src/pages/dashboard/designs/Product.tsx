// components/products/Products.tsx

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
import {
  getDesignsFn,
  reorderDesigns,
  updateDesignsOrderFn,
  type Design,
} from "@/redux/slices/product/get-designs";
import type { AppDispatch, RootState } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDesignDialog from "./CreateDialogProduct";

// DnD Kit imports
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";
import { SortableCard } from "./SortableCard";
import { SortableTableRow } from "./SortableTableRow";
import toast from "react-hot-toast";

// Debounce hook
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) {
  const timeoutRef = useRef<any | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { debouncedFn, cancel };
}

const Products = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null); // Changed to number
  const [isSaving, setIsSaving] = useState(false);

  const { data: designs, isReordering } = useSelector(
    (state: RootState) => state.getDesigns,
  );
  const dispatch = useDispatch<AppDispatch>();

  // Keep track of previous order for rollback
  const previousOrderRef = useRef<Design[]>([]);

  // Optimized sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  const toastId: string = "toastId";

  // Save order to backend
  const saveOrder = useCallback(
    async (newOrder: Design[]) => {
      setIsSaving(true);
      try {
        // Extract IDs as numbers
        const orderedIds = newOrder.map((d) => d.id);
        await dispatch(updateDesignsOrderFn(orderedIds)).unwrap();

        toast.success("The products order has been updated.", { id: toastId });
      } catch (error) {
        console.error("Failed to save order:", error);
        // Revert to previous order
        dispatch(reorderDesigns(previousOrderRef.current));
        toast.error("Failed to save order. Reverted to previous order.", {
          id: toastId,
        });
      } finally {
        setIsSaving(false);
      }
    },
    [dispatch, toast],
  );

  // Debounced save
  const { debouncedFn: debouncedSave, cancel: cancelSave } = useDebounce(
    saveOrder,
    500,
  );

  useEffect(() => {
    const fetchDesigns = async () => {
      setIsLoading(true);
      await dispatch(getDesignsFn());
      setIsLoading(false);
    };
    fetchDesigns();

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
      cancelSave();
    };
  }, [dispatch, cancelSave]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id as number);
      previousOrderRef.current = [...designs];
    },
    [designs],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) {
        return;
      }

      // Find indices using number comparison
      const oldIndex = designs.findIndex((d) => d.id === active.id);
      const newIndex = designs.findIndex((d) => d.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      // Optimistic update
      const newOrder = arrayMove([...designs], oldIndex, newIndex);
      dispatch(reorderDesigns(newOrder));

      // Debounced save
      debouncedSave(newOrder);
    },
    [designs, dispatch, debouncedSave],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeDesign =
    activeId !== null ? designs.find((d) => d.id === activeId) : null;

  // Skeleton components
  const SkeletonCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-16" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full mb-2" />
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
          <TableHead className="w-10"></TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Options</TableHead>
          <TableHead>Printable</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-12 w-12" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-12" />
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
      <div className="flex w-full justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Products</h1>
          {(isReordering || isSaving) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Saving...</span>
            </div>
          )}
        </div>
        <CreateDesignDialog />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToVerticalAxis]}
      >
        {isMobile ? (
          <div className="space-y-4 px-4">
            {isLoading ? (
              [...Array(3)].map((_, index) => <SkeletonCard key={index} />)
            ) : Array.isArray(designs) && designs.length > 0 ? (
              <SortableContext
                items={designs.map((d) => d.id)}
                strategy={verticalListSortingStrategy}
              >
                {designs.map((design) => (
                  //@ts-ignore
                  <SortableCard key={design.id} design={design} />
                ))}
              </SortableContext>
            ) : (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No designs found.
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
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Printable</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(designs) && designs.length > 0 ? (
                    <SortableContext
                      items={designs.map((d) => d.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {designs.map((design) => (
                        //@ts-ignore
                        <SortableTableRow key={design.id} design={design} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        No designs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        <DragOverlay dropAnimation={null}>
          {activeDesign ? (
            isMobile ? (
              <Card className="shadow-2xl rotate-2 scale-105">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm truncate">
                    {activeDesign.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {activeDesign.images?.[0] && (
                    <img
                      src={activeDesign.images[0]}
                      alt={activeDesign.title}
                      className="w-full h-20 object-cover rounded"
                    />
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="bg-background shadow-2xl border rounded-lg p-3 flex items-center gap-4 rotate-1 scale-105">
                {activeDesign.images?.[0] ? (
                  <img
                    src={activeDesign.images[0]}
                    alt={activeDesign.title}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <div className="h-10 w-10 bg-muted rounded" />
                )}
                <span className="font-medium">{activeDesign.title}</span>
                <span className="text-muted-foreground">
                  ${activeDesign.price.toFixed(2)}
                </span>
              </div>
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Products;
