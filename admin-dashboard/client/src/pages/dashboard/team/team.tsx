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
import { getTeamFn } from "@/redux/slices/teams/GetTeam";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GripVertical, Plus } from "lucide-react";
import CreateDialogTeam from "./CreateDialogTeam";
import DeleteDialogTeam from "./DeleteDialogTeam";
import UpdateDialogTeam from "./UpdateDialogTeam";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateTeamOrderFn } from "@/redux/slices/teams/Team-Order";
import type { RootState } from "@/redux/store";

// Sortable Item Component for Mobile Cards
function SortableTeamCard({ team }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: team.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "shadow-lg z-50" : "shadow-sm"}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded touch-none"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={team.imageUrl || "/placeholder.svg"}
                alt={team.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {team.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{team.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {team.id}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <UpdateDialogTeam team={team} />
            <DeleteDialogTeam team={team.id} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {team.description || "No description available"}
        </p>
        <div className="text-xs text-muted-foreground">
          Created: {new Date(team.createAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

// Sortable Item Component for Desktop Table Rows
function SortableTableRow({ team }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: team.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "shadow-lg bg-muted/50 z-50" : ""}
    >
      <TableCell>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded inline-flex touch-none"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </TableCell>
      <TableCell className="font-medium">{team.id}</TableCell>
      <TableCell className="font-semibold">{team.name}</TableCell>
      <TableCell>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={team.imageUrl || "/placeholder.svg"}
            alt={team.name}
          />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {team.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="max-w-xs truncate">
        {team.description || "No description"}
      </TableCell>
      <TableCell>{new Date(team.createAt).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          <UpdateDialogTeam team={team} />
          <DeleteDialogTeam team={team.id} />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function Team() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const teams: any = useSelector((state: RootState) => state.getTeam);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    //@ts-ignore
    dispatch(getTeamFn());
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [dispatch]);

  const teamsData = teams?.data || [];

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = Number.parseInt(active.id);
    const overId = Number.parseInt(over.id);

    const oldIndex = teamsData.findIndex((team: any) => team.id === activeId);
    const newIndex = teamsData.findIndex((team: any) => team.id === overId);

    if (oldIndex === -1 || newIndex === -1) {
      console.error("Could not find team indices", {
        activeId,
        overId,
        oldIndex,
        newIndex,
      });
      return;
    }

    // Don't update if positions are the same
    if (oldIndex === newIndex) {
      return;
    }

    setIsLoading(true);

    try {
      // Create the new ordered array
      const reorderedTeams = arrayMove([...teamsData], oldIndex, newIndex);

      // Create newOrder payload to match your backend API
      const newOrder = reorderedTeams.map((team: any, index) => ({
        id: team.id,
        order: index + 1,
      }));

      console.log("New order payload:", newOrder);

      // Dispatch the update order action with newOrder as the payload
      //@ts-ignore
      const resultAction = await dispatch(updateTeamOrderFn(newOrder));

      console.log("Update result:", resultAction);

      // Check if the action was fulfilled
      if (updateTeamOrderFn.fulfilled.match(resultAction)) {
        console.log("Team order updated successfully");
        // Refresh the teams data
        //@ts-ignore
        await dispatch(getTeamFn());
      } else if (updateTeamOrderFn.rejected.match(resultAction)) {
        console.error("Failed to update team order:", resultAction.payload);
        alert("Failed to update team order: " + resultAction.payload);
      }
    } catch (error) {
      console.error("Error in handleDragEnd:", error);
      alert("An error occurred while updating team order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (teams?.loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6 px-4">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop to reorder teams
          </p>
        </div>
        <CreateDialogTeam />
      </div>

      {teamsData.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No teams found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first team
          </p>
          <CreateDialogTeam />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={teamsData.map((team: any) => team.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {isMobile ? (
              <div className="space-y-4 px-4">
                {teamsData.map((team: any, index: any) => (
                  <SortableTeamCard key={team.id} team={team} index={index} />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="">Image</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[120px]">Created At</TableHead>
                      <TableHead className="text-right w-[120px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamsData.map((team: any, index: any) => (
                      <SortableTableRow
                        key={team.id}
                        team={team}
                        index={index}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SortableContext>
        </DndContext>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span>Updating order...</span>
          </div>
        </div>
      )}
    </div>
  );
}
