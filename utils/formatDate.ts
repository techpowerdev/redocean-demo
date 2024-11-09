import moment from "moment";

export const formatDateTimeTH = (dateString: string): string => {
  // return moment(dateString).format("DD/MM/YYYY HH:mm [น.]");
  return moment(dateString, "DD/MM/YYYY HH:mm:ssZ").format(
    "DD/MM/YYYY HH:mm [น.]"
  );
};

export const formatDayCount = (date: Date): string => {
  const dateIn = new Date(date);
  return moment(dateIn).fromNow(); // แปลงวันที่เป็นรูปแบบที่อ่านง่าย เช่น "1 วันที่แล้ว"
};

// สำหรับจัดการเวลาใน event โดยแปลงเป็น ไทย
export const formatDateTimeEvent = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate}, ${formattedTime}`;
};
