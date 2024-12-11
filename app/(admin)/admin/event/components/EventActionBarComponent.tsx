import React from "react";
import { CreateEvent } from "./CreateEvent";

export default function EventActionBarComponent() {
  return (
    <div className="flex justify-end items-center gap-2">
      {/* <AddEvent /> */}
      <CreateEvent />
    </div>
  );
}
