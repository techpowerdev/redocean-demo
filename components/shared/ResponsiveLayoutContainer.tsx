"use client";

import { useEffect, useState } from "react";

type ResponsiveContainerProps = {
  children: React.ReactNode;
  className?: string;
  footerHeight?: number;
};

export default function ResponsiveLayoutContainer({
  children,
  className = "",
  footerHeight = 85,
}: ResponsiveContainerProps) {
  const [viewHeight, setViewHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      setViewHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div
      className={`flex flex-col ${className}`}
      style={{
        height: viewHeight
          ? `calc(${viewHeight}px - ${footerHeight}px)`
          : `calc(100vh - ${footerHeight}px)`,
      }}
    >
      {children}
    </div>
  );
}
