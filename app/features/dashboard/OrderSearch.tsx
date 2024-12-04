"use client";

import { searchOrders } from "@/services/orderServices";
import { OrderType } from "@/types/fetchTypes";
import React, { useEffect, useState } from "react";

export default function OrderSearch() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const filters = {
          status: "pending",
          orderType: "groupbuying",
          startDate: "2024-11-01",
          endDate: "2024-11-21",
        };
        const result = await searchOrders(filters);
        if (result) {
          console.log(result);
          setOrders(result);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>Order ID: {order.id}</p>
            <p>Total Amount: {order.totalAmount}</p>
            <p>Status: {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
