"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import React from "react";
import ActionBar from "./ActionBar";

interface Props {
  LeftHeading?: string;
  RightHeading?: string;
  LeftActionBarComponent?: React.ReactNode; // prop ที่รับ child component
  RightActionBarComponent?: React.ReactNode;
  LeftComponent?: React.ReactNode;
  RightComponent?: React.ReactNode;
}

export default function PagePanelLayout({
  LeftHeading,
  RightHeading,
  LeftActionBarComponent,
  RightActionBarComponent,
  LeftComponent,
  RightComponent,
}: Props) {
  return (
    <ResizablePanelGroup
      direction="horizontal" // แบ่ง layout โดยจัดเรียงไปตามแนวนอน
      className="h-full"
    >
      <ResizablePanel
        defaultSize={40}
        minSize={20} // ขนาดเล็กสุดที่ย่อลงไปถึงได้
        maxSize={80} // ขนาดใหญ่สุดที่ขยายไปถึงได้
      >
        <div className="h-full flex flex-col">
          <div className="h-[52px] flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">{LeftHeading}</h1>
          </div>
          <Separator />
          {LeftActionBarComponent && (
            <>
              <ActionBar>{LeftActionBarComponent}</ActionBar>
              <Separator />
            </>
          )}
          {LeftComponent}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} minSize={20}>
        <div className="h-full flex flex-col">
          <div className="h-[52px] flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">{RightHeading}</h1>
          </div>
          <Separator />
          {RightActionBarComponent && (
            <div>
              <ActionBar>{RightActionBarComponent}</ActionBar>
              <Separator />
            </div>
          )}
          {RightComponent}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
