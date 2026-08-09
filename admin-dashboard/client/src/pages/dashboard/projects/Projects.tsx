import { GripVertical, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/redux/store";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { getCategoryFn } from "../../../redux/slices/category/GetCategory";
import { getProjectFn } from "../../../redux/slices/projects/GetProject";
import { updateProjectOrderFn } from "../../../redux/slices/projects/Project-Order";
import CreateDialogProject from "./CreateDialogProject";
import DeleteDialogProject from "./DeleteDialogProject";
import ProjectDescription from "./project-description";
import UpdateDialogProject from "./UpdateDialogProject";

// Sortable Project Card Component for Mobile
function SortableProjectCard({ project, categories }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id.toString(),
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
      className={`mb-4 ${isDragging ? "shadow-lg z-50" : "shadow-sm"}`}
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
            <Avatar>
              <AvatarImage
                src={
                  Array.isArray(project.imageUrl)
                    ? project.imageUrl[0]
                    : project.imageUrl
                }
                alt={project.name}
              />
              <AvatarFallback>
                {project.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-bold">{project.name}</span>
          </div>
          <div className="flex space-x-2">
            <UpdateDialogProject
              categories={categories}
              category={project.category.id}
              project={project}
            />
            <DeleteDialogProject project={project.id} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProjectDescription
          description={project.description}
          maxLength={120}
          className="text-sm text-muted-foreground mb-2"
        />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span>Category: {project.category.name}</span>
          <span>ID: {project.id}</span>
          <span>Client: {project.client || "N/A"}</span>
          <span>
            Created: {new Date(project.createAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Sortable Table Row Component for Desktop
function SortableProjectRow({ project, categories }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id.toString(),
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
      <TableCell className="font-medium max-w-[200px]">
        <div className="truncate" title={project.name}>
          {project.name}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-[300px]">
        <ProjectDescription
          description={project.description}
          maxLength={100}
          className="text-sm"
        />
      </TableCell>
      <TableCell>
        <Avatar>
          <AvatarImage
            src={
              Array.isArray(project.imageUrl)
                ? project.imageUrl[0]
                : project.imageUrl
            }
            alt={project.name}
          />
          <AvatarFallback>
            {project.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {project.category.name}
        </span>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {project.client || "N/A"}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(project.createAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <UpdateDialogProject
            categories={categories}
            category={project.category.id}
            project={project}
          />
          <DeleteDialogProject project={project.id} />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function Project() {
  const [screenSize, setScreenSize] = useState("large");
  const [isLoading, setIsLoading] = useState(false);
  const projects = useSelector((state: RootState) => state.getProject);
  const categories = useSelector((state: RootState) => state.getCategory);
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
    dispatch(getProjectFn());
    //@ts-ignore
    dispatch(getCategoryFn());

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

  const projectsData = projects?.data || [];

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = Number.parseInt(active.id);
    const overId = Number.parseInt(over.id);

    const oldIndex = projectsData.findIndex(
      (project: any) => project.id === activeId
    );
    const newIndex = projectsData.findIndex(
      (project: any) => project.id === overId
    );

    if (oldIndex === -1 || newIndex === -1) {
      console.error("Could not find project indices", {
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
      const reorderedProjects = arrayMove(
        [...projectsData],
        oldIndex,
        newIndex
      );

      // Create newOrder payload to match your backend API
      const newOrder = reorderedProjects.map((project: any, index) => ({
        id: +project.id,
        order: index + 1,
      }));

      console.log("New project order payload:", newOrder);

      // Dispatch the update order action with newOrder as the payload
      //@ts-ignore
      const resultAction = await dispatch(updateProjectOrderFn(newOrder));

      console.log("Update result:", resultAction);

      // Check if the action was fulfilled
      if (updateProjectOrderFn.fulfilled.match(resultAction)) {
        console.log("Project order updated successfully");
        // Refresh the projects data
        //@ts-ignore
        await dispatch(getProjectFn());
      } else if (updateProjectOrderFn.rejected.match(resultAction)) {
        console.error("Failed to update project order:", resultAction.payload);
        alert("Failed to update project order: " + resultAction.payload);
      }
    } catch (error) {
      console.error("Error in handleDragEnd:", error);
      alert(
        "An error occurred while updating project order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderProjectTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="hidden lg:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Client</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(projectsData) && projectsData.length > 0 ? (
            projectsData.map((project: any) => (
              <SortableProjectRow
                key={project.id}
                project={project}
                categories={categories?.data}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium">No projects found</p>
                  <p className="text-sm">
                    Create your first project to get started
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  // if (projects.isLoading) {
  //   return <ProjectsLoadingSkeleton count={5} />
  // }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop to reorder projects
          </p>
        </div>
        <CreateDialogProject categories={categories?.data} />
      </div>

      {/* Projects count */}
      {Array.isArray(projectsData) && projectsData.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {projectsData.length} project
            {projectsData.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {projectsData.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first project
          </p>
          <CreateDialogProject categories={categories?.data} />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projectsData.map((project: any) => project.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {screenSize === "small" ? (
              <div className="space-y-4">
                {projectsData.map((project: any) => (
                  <SortableProjectCard
                    key={project.id}
                    project={project}
                    categories={categories?.data}
                  />
                ))}
              </div>
            ) : (
              renderProjectTable()
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
