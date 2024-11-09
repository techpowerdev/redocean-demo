"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/shared/Loading";
import { EventList } from "./EventList";
import { useEventStore } from "@/state-stores/admin/adminEventStore";
import { EventType } from "@/types/fetchTypes";

export default function EventListComponent() {
  const eventLists = useEventStore((state) => state.eventLists);
  const setEventLists = useEventStore((state) => state.setEventLists);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]); // State for filtered products
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error message

  useEffect(() => {
    const getAllEvents = async () => {
      setLoading(true); // Set loading to true when fetching
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events/all`
        );
        setEventLists(data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("ไม่สามารถโหลดสินค้าได้"); // Set error message
        setLoading(false); // Set loading to false in case of error
      }
    };
    getAllEvents();
  }, [setEventLists]);

  useEffect(() => {
    // Filter products based on the search term
    if (searchTerm && eventLists) {
      const results = eventLists.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(results);
    } else {
      setFilteredEvents(eventLists || []); // Set to empty array if undefined
    }
  }, [searchTerm, eventLists]);

  let component;
  if (loading) {
    component = (
      <div>
        <Loading />
      </div>
    ); // Loading state
  }

  if (error) {
    component = <div className="text-center text-red-500">{error}</div>; // Display error message
  }

  if (searchTerm && filteredEvents.length === 0) {
    component = <div className="text-center">ไม่พบกิจกรรม</div>; // No events found
  }

  return (
    <>
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
          </div>
        </form>
      </div>
      {component ? (
        component
      ) : (
        <div className="m-0">
          <EventList events={filteredEvents} />
        </div>
      )}
    </>
  );
}
