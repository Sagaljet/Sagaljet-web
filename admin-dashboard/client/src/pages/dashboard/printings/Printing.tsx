import { DollarSign, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrintingsLoadingSkeleton } from "./PrintingSkeleton";
import UpdateDialogPrinting from "./UpdateDialogPrinting";
import DeleteDialogPrinting from "./DeleteDialogPrinting";
import CreateDialogPrinting from "./CreateDialogPrinting";
import { getPrintingsFn } from "@/redux/slices/printings/getPrintingsSlice";

// Printing Card Component for Mobile
function PrintingCard({ printing }: any) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <span className="font-bold">{printing.name}</span>
              {printing.size && (
                <p className="text-xs text-muted-foreground">
                  Size: {printing.size}
                </p>
              )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>${printing.price.toFixed(2)}</span>
          </div>
          {printing.description && (
            <div
              className="text-muted-foreground line-clamp-2"
              dangerouslySetInnerHTML={{ __html: printing.description }}
            />
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <UpdateDialogPrinting printing={printing} />
          <DeleteDialogPrinting
            printingId={printing.id}
            printingName={printing.name}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Table Row Component for Desktop
function PrintingTableRow({ printing }: any) {
  return (
    <TableRow>
      <TableCell className="font-medium max-w-[200px]">
        <div className="truncate" title={printing.name}>
          {printing.name}
        </div>
        {printing.size && (
          <p className="text-xs text-muted-foreground truncate">
            {printing.size}
          </p>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-[300px]">
        <div
          className="truncate"
          title={printing.description?.replace(/<[^>]*>/g, "") || ""}
          dangerouslySetInnerHTML={{
            __html: printing.description || "—",
          }}
        />
      </TableCell>
      <TableCell className="font-semibold">
        ${printing.price.toFixed(2)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <UpdateDialogPrinting printing={printing} />
          <DeleteDialogPrinting
            printingId={printing.id}
            printingName={printing.name}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function Printing() {
  const [screenSize, setScreenSize] = useState("large");
  const printings = useSelector((state: RootState) => state.getPrintings);
  const dispatch = useDispatch();

  useEffect(() => {
    //@ts-ignore
    dispatch(getPrintingsFn());

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

  const printingsData = printings?.data || [];

  const renderPrintingTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(printingsData) && printingsData.length > 0 ? (
            printingsData.map((printing: any) => (
              <PrintingTableRow key={printing.id} printing={printing} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium">No printing types found</p>
                  <p className="text-sm">
                    Create your first printing type to get started
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (printings.isLoading) {
    return <PrintingsLoadingSkeleton count={5} />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Printing Types</h1>
          <p className="text-muted-foreground mt-1">
            Manage your printing type collection
          </p>
        </div>
        <div className="flex gap-2">
          <CreateDialogPrinting />
        </div>
      </div>

      {Array.isArray(printingsData) && printingsData.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {printingsData.length} printing type
            {printingsData.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {printingsData.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            No printing types found
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first printing type
          </p>
          <CreateDialogPrinting />
        </div>
      ) : (
        <>
          {screenSize === "small" ? (
            <div className="space-y-4">
              {printingsData.map((printing: any) => (
                <PrintingCard key={printing.id} printing={printing} />
              ))}
            </div>
          ) : (
            renderPrintingTable()
          )}
        </>
      )}
    </div>
  );
}
