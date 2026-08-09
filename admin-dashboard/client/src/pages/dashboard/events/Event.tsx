import { Calendar, MapPin, Plus, Clock, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import type { RootState } from "@/redux/store";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventsFn, getAllEventsFn } from "@/redux/slices/event/get-events";
import { toggleEventStatusFn } from "@/redux/slices/event/toggleEventStatus";
import CreateDialogEvent from "./CreateDialogEvent";
import DeleteDialogEvent from "./DeleteDialogEvent";
import UpdateDialogEvent from "./UpdateDialogEvent";
import { EventsLoadingSkeleton } from "./EventSkeleton";
import toast from "react-hot-toast";

// Event Card Component for Mobile
function EventCard({ event }: any) {
  const dispatch = useDispatch();

  const handleToggleStatus = async () => {
    //@ts-ignore
    await dispatch(toggleEventStatusFn(event.id));
    //@ts-ignore
    dispatch(getAllEventsFn());
    toast.success(`Event ${event.isActive ? "deactivated" : "activated"}`);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={event.imageUrl} alt={event.title} />
              <AvatarFallback>
                {event.title.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-bold">{event.title}</span>
              <Badge
                variant={event.isActive ? "default" : "secondary"}
                className="ml-2"
              >
                {event.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {event.description && (
            <p className="text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(event.startAt), "PPP")}</span>
          </div>
          {event.endAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Ends: {format(new Date(event.endAt), "PPP")}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleToggleStatus}>
            {event.isActive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <UpdateDialogEvent event={event} />
          <DeleteDialogEvent eventId={event.id} eventTitle={event.title} />
        </div>
      </CardContent>
    </Card>
  );
}

// Table Row Component for Desktop
function EventTableRow({ event }: any) {
  const dispatch = useDispatch();

  const handleToggleStatus = async () => {
    //@ts-ignore
    await dispatch(toggleEventStatusFn(event.id));
    //@ts-ignore
    dispatch(getAllEventsFn());
    toast.success(`Event ${event.isActive ? "deactivated" : "activated"}`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium max-w-[200px]">
        <div className="truncate" title={event.title}>
          {event.title}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-[300px]">
        <div className="truncate" title={event.description || ""}>
          {event.description || "—"}
        </div>
      </TableCell>
      <TableCell>
        <Avatar>
          <AvatarImage src={event.imageUrl} alt={event.title} />
          <AvatarFallback>
            {event.title.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {event.location || "—"}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {format(new Date(event.startAt), "PP")}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {event.endAt ? format(new Date(event.endAt), "PP") : "—"}
      </TableCell>
      <TableCell>
        <Badge variant={event.isActive ? "default" : "secondary"}>
          {event.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={handleToggleStatus}>
            {event.isActive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <UpdateDialogEvent event={event} />
          <DeleteDialogEvent eventId={event.id} eventTitle={event.title} />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function Event() {
  const [screenSize, setScreenSize] = useState("large");
  const [showAll, setShowAll] = useState(false);
  const events = useSelector((state: RootState) => state.getEvents);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showAll) {
      //@ts-ignore
      dispatch(getAllEventsFn());
    } else {
      //@ts-ignore
      dispatch(getEventsFn());
    }

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
  }, [dispatch, showAll]);

  const eventsData = events?.data || [];

  const renderEventTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="hidden lg:table-cell">Location</TableHead>
            <TableHead className="hidden md:table-cell">Start Date</TableHead>
            <TableHead className="hidden lg:table-cell">End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(eventsData) && eventsData.length > 0 ? (
            eventsData.map((event: any) => (
              <EventTableRow key={event.id} event={event} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium">No events found</p>
                  <p className="text-sm">
                    Create your first event to get started
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (events.isLoading) {
    return <EventsLoadingSkeleton count={5} />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">
            Manage your events and activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Active Only" : "Show All Events"}
          </Button>
          <CreateDialogEvent />
        </div>
      </div>

      {Array.isArray(eventsData) && eventsData.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {eventsData.length} event
            {eventsData.length !== 1 ? "s" : ""}
            {!showAll && " (active only)"}
          </p>
        </div>
      )}

      {eventsData.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first event
          </p>
          <CreateDialogEvent />
        </div>
      ) : (
        <>
          {screenSize === "small" ? (
            <div className="space-y-4">
              {eventsData.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            renderEventTable()
          )}
        </>
      )}
    </div>
  );
}
