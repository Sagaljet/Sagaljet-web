// components/products/SortableCard.tsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  features: any[];
}

interface SortableCardProps {
  design: Design;
}

export const SortableCard = ({ design }: SortableCardProps) => {
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
  };

  return (
    <Card ref={setNodeRef} style={style} className={isDragging ? "shadow-lg" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="truncate">{design.title}</span>
          </div>
          <Badge variant={design.isPrintable ? "default" : "secondary"}>
            {design.isPrintable ? "Printable" : "Not Printable"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {design.images && design.images.length > 0 && (
          <img
            src={design.images[0]}
            alt={design.title}
            className="w-full h-32 object-cover rounded"
          />
        )}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {design.description || "No description"}
        </p>
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-lg">
            ${design.price.toFixed(2)}
          </span>
          <Badge variant="outline">
            {design.features?.length || 0} features
          </Badge>
        </div>
        <div className="flex gap-2 pt-2 border-t">
          <UpdateDialogDesign design={design} />
          <DeleteDialogDesign designId={design.id} designTitle={design.title} />
        </div>
      </CardContent>
    </Card>
  );
};