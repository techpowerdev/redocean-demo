"use client";
import { EventType } from "@/types/fetchTypes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import GroupBuyEventProductCard from "./GroupBuyEventProductCard";
import { EventCountdown } from "./EventCountdown";
import { formatDateTimeEvent } from "@/utils/formatDate";

export default function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events/today`
        );
        setEvents(data);
      } catch (error) {
        console.error("Error fetching :", error);
      }
    };
    fetchEvents();
  }, []);
  return (
    <div>
      {events.map((event: EventType) => (
        <div key={event.id}>
          <EventCountdown
            startTime={formatDateTimeEvent(event.startTime)}
            endTime={formatDateTimeEvent(event.endTime)}
          />
          {event.type === "groupBuyEvent" &&
            event.groupBuyEvent?.map((item) => (
              <div key={item.id}>
                <GroupBuyEventProductCard
                  orderType={event.type}
                  eventProduct={item}
                />
              </div>
            ))}
          {event.type === "flashSale" && <div>{event.type}flashsale</div>}
        </div>
      ))}
    </div>
  );
}
