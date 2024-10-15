import prisma from "@/libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export async function getAllOrders() {
  const currentUser = await getCurrentUser();
  const orders = await prisma?.order.findMany({
    where: {
      userId: currentUser?.id,
    },
  });

  return orders;
}
export async function getOneOrder(id: string) {
  const order = await prisma?.order.findUnique({
    where: {
      id: id,
    },
  });

  return order;
}
