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
