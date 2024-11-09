import React from "react";
import PagePanelLayout from "@/app/(admin)/admin/components/shared/PagePanelLayout";
import EventActionBarComponent from "./components/EventActionBarComponent";
import EventListComponent from "./components/EventListComponent";
import EventDetailComponent from "./components/EventDetailComponent";
import CreateEventForm from "./components/forms/CreateEventForm";

export default function page() {
  return (
    <PagePanelLayout
      LeftHeading="กิจกรรม"
      RightHeading="รายละเอียดกิจกรรม"
      LeftActionBarComponent={<EventActionBarComponent />}
      LeftComponent={<EventListComponent />}
      RightComponent={<EventDetailComponent />}
    />
    // <CreateEventForm />
  );
}
