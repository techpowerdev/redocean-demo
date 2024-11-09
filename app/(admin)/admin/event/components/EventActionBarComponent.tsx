import React from "react";
import AddEvent from "./AddEvent";

export default function EventActionBarComponent() {
  return (
    <div className="flex justify-end items-center gap-2">
      <AddEvent />
    </div>
  );
}