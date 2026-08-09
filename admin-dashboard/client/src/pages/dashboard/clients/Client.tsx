import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClientFn } from "@/redux/slices/clients/GetClient";
import type { RootState } from "@/redux/store";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDialogClient from "./CreateDialogClient";
import DeleteDialogClinet from "./DeleteDialogClient";
import UpdateDialogClient from "./UpdateDialogClient";

export default function Client() {
  const [isMobile, setIsMobile] = useState(false);
  const client = useSelector((state: RootState) => state.getClient);
  const disptach = useDispatch();

  useEffect(() => {
    //@ts-ignore
    disptach(getClientFn());
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [disptach]);

  const handleDelete = (clientId: any) => {
    // Implement delete functionality here
    console.log(`Delete client with ID: ${clientId}`);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-3xl font-bold">Client</h1>
        {/* dialog */}
        <CreateDialogClient />
      </div>
      {isMobile ? (
        <div className="space-y-4">
          {Array.isArray(client.data) && client.data.length > 0 ? (
            client.data.map((client) => (
              <Card key={client.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={client.logoUrl} alt={client.name} />
                        <AvatarFallback>
                          {client.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{client.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" asChild>
                        {/* <Link to={`/dashboard/clients/edit/${client.id}`}> */}
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        {/* </Link> */}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {client.description}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>ID: {client.id}</span>
                    <span>
                      Created: {new Date(client.createAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No clients found.</p>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(client.data) && client.data.length > 0 ? (
                client.data.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={client.logoUrl} alt={client.name} />
                        <AvatarFallback>
                          {client.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{client.description}</TableCell>
                    <TableCell>
                      {new Date(client.createAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <UpdateDialogClient client={client} />
                        <DeleteDialogClinet client={client.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <p>No clients found.</p>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
