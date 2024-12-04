import React from "react";
import PagePanelLayout from "@/app/(admin)/admin/components/shared/PagePanelLayout";
import EventActionBarComponent from "./components/EventActionBarComponent";
import EventListComponent from "./components/EventListComponent";
import EventDetailComponent from "./components/EventDetailComponent";
import { EventRightActionToolbar } from "./components/EventRightActionToolbar";

export default function page() {
  return (
    <PagePanelLayout
      LeftHeading="กิจกรรม"
      RightHeading="รายละเอียดกิจกรรม"
      LeftActionBarComponent={<EventActionBarComponent />}
      LeftComponent={<EventListComponent />}
      RightComponent={<EventDetailComponent />}
      RightActionBarComponent={<EventRightActionToolbar />}
    />
    // <CreateEventForm />
  );
}
