export const checkIsEventTime = (startAt: string, endAt: string): boolean => {
  const now = new Date();
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);
  const result = now >= startDate && now <= endDate;
  console.log(result);
  // คืนค่า true ถ้าเวลาปัจจุบันอยู่ในช่วงเวลาของกิจกรรม
  return result;
};
