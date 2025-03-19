import moment from "moment";

export const formatDateTimeTH = (dateString: string): string => {
  // return moment(dateString).format("DD/MM/YYYY HH:mm [น.]");
  return moment(dateString, "DD/MM/YYYY HH:mm:ssZ").format(
    "DD/MM/YYYY HH:mm [น.]"
  );
};

export function formatDateToDatetimeLocal(date: string): string {
  // แปลงวันที่จาก "2024-11-19T12:25:00.000Z" เป็น "2024-11-19T12:25"
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const formatDayCount = (date: Date): string => {
  const dateIn = new Date(date);
  return moment(dateIn).fromNow(); // แปลงวันที่เป็นรูปแบบที่อ่านง่าย เช่น "1 วันที่แล้ว"
};

// สำหรับจัดการเวลาใน promotion โดยแปลงเป็น ไทย
export const formatDateTimePromotion = (dateInput: Date | string): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

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

export const convertUtcToLocal = (
  utcDate: string,
  timezoneOffset: number = 0
): string => {
  // สร้าง Date object จาก UTC string
  const date = new Date(utcDate);

  // คำนวณเวลาท้องถิ่นโดยการเพิ่มหรือหักเวลา offset
  date.setHours(date.getHours() + timezoneOffset);

  // แปลงเป็นรูปแบบ ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
  return date.toISOString().split("T")[0]; // คืนค่าเฉพาะวันที่ (YYYY-MM-DD)
};

// ตัวอย่างการใช้งาน
// const utcDate = "2024-11-20T17:08:00.000Z";
// const timezoneOffset = 7; // สำหรับ UTC+7 (ประเทศไทย)

// const localDate = convertUtcToLocal(utcDate, timezoneOffset);
// console.log(localDate); // Output: "2024-11-21"
