import axios from "axios";
import authAxios from "@/lib/authAxios";
import {
  FlexBox,
  SendFlexMessageToLineParams,
  SendMessageToLineParams,
} from "@/types/lineTypes";

export async function sendMessageToLine(data: SendMessageToLineParams) {
  try {
    const response = await authAxios.post(`/line/send-text-message`, data);
    return response.data; // ส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function sendFlexMessageToLine(data: SendFlexMessageToLineParams) {
  try {
    const response = await authAxios.post(`/line/send-flex-message`, data);
    return response.data; // ส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export function createProductItem(
  name: string,
  price: string,
  quantity: string
): FlexBox {
  return {
    type: "box",
    layout: "horizontal",
    justifyContent: "space-between",
    alignItems: "flex-start",
    contents: [
      {
        type: "text",
        text: name,
        size: "sm",
        color: "#555555",
        flex: 1,
        wrap: true,
      },
      {
        type: "text",
        text: `${quantity + " x " + price}`,
        size: "sm",
        color: "#111111",
        align: "end",
      },
      // { type: "text", text: quantity, size: "sm", align: "end" },
    ],
  };
}

export function createSummaryItem(label: string, value: string): FlexBox {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      { type: "text", text: label, size: "sm", color: "#555555" },
      { type: "text", text: value, size: "sm", color: "#111111", align: "end" },
    ],
  };
}
