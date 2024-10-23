export function convertPhoneNumber(phoneNumber: string) {
  // เช็คว่าเบอร์โทรศัพท์เริ่มต้นด้วย 0 หรือไม่ และมี 10 หลัก
  if (phoneNumber.startsWith("0") && phoneNumber.length === 10) {
    return "66" + phoneNumber.slice(1); // ลบ 0 และเพิ่มรหัสประเทศ '66' ข้างหน้า
  }
  return phoneNumber; // หากไม่เป็นไปตามรูปแบบ ก็คืนค่าเดิม
}
