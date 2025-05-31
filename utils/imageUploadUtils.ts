export const widthClass: Record<string, string> = {
  "40": "w-40",
  "52": "w-52",
  "64": "w-64",
  "80": "w-80",
  "96": "w-96",
};

export const heightClass: Record<string, string> = {
  "40": "h-40",
  "52": "h-52",
  "64": "h-64",
  "80": "h-80",
  "96": "h-96",
};

// ฟังก์ชันเลือก Tailwind class ตามค่าที่กำหนด
export const withClass = (width: string, height: string) => {
  return `${widthClass[width] || ""} ${heightClass[height] || ""}`.trim();
};

export const aspectRatioClass = {
  "1/1": "aspect-[1/1]",
  "2/3": "aspect-[1/1]",
  "3/4": "aspect-[1/1]",
  "4/5": "aspect-[1/1]",
  "16/9": "aspect-[16/9]",
};

export type AspectRatio = "1/1" | "2/3" | "3/4" | "4/5" | "16/9";

export type Width = "40" | "52" | "64" | "80" | "96";

export type Height = "40" | "52" | "64" | "80" | "96";
