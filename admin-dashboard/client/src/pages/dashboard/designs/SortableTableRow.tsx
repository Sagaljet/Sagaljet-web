// components/products/SortableTableRow.tsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import UpdateDialogDesign from "./UpdateDialogProduct";
import DeleteDialogDesign from "./DeleteDialogProduct";

interface Design {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  price: number;
  isPrintable: boolean;
  components: any[];
}

interface SortableTableRowProps {
  design: Design;
}

export const SortableTableRow = ({ design }: SortableTableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: design.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "var(--muted)" : undefined,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell>
        {design.images && design.images.length > 0 ? (
          <img
            src={design.images[0]}
            alt={design.title}
            className="h-12 w-12 object-cover rounded"
          />
        ) : (
          <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs">
            No image
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{design.title}</TableCell>
      <TableCell className="max-w-xs truncate">
        {design.description || "—"}
      </TableCell>
      <TableCell>${design.price.toFixed(2)}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {design?.components?.length || 0} Options
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={design.isPrintable ? "default" : "secondary"}>
          {design.isPrintable ? "Yes" : "No"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <UpdateDialogDesign design={design} />
          <DeleteDialogDesign designId={design.id} designTitle={design.title} />
        </div>
      </TableCell>
    </TableRow>
  );
};