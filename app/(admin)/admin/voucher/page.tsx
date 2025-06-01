"use client";

import GiftVoucherCard from "@/app/features/voucher/GiftVoucherCard";
import PageTitle from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { getAllVoucherGroups } from "@/services/voucherServices";
import { GetAllVoucherGroupsResponse } from "@/types/voucherTypes";
import { CirclePlus, Pencil } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VoucherPage() {
  const [voucherGroups, setVoucherGroups] = useState<
    GetAllVoucherGroupsResponse["data"]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const voucherGroups = await getAllVoucherGroups();
      setVoucherGroups(voucherGroups.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center gap-2 mb-4">
        <PageTitle title="บัตร Voucher" />
        <div className="flex justify-end items-center gap-2">
          <Link href={"/admin/voucher/create"}>
            <Button className="bg-primary flex gap-2 items-center px-3">
              <CirclePlus />
              เพิ่มบัตร voucher
            </Button>
          </Link>
        </div>
      </div>
      {voucherGroups.length ? (
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {voucherGroups.map((voucherGroup) => (
            <div key={voucherGroup.id}>
              <GiftVoucherCard
                storeName={voucherGroup?.storeName || ""}
                value={voucherGroup?.amount ?? 0}
                expiryDate={voucherGroup?.expiresAt || ""}
              />
              <hr className="border-white" />
              <Link href={`/admin/voucher/edit/${voucherGroup.id}`}>
                <Button className="w-full bg-primary flex gap-2 items-center px-3">
                  <Pencil />
                  แก้ไขบัตร voucher
                </Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-red-500">ยังไม่มี voucher</div>
      )}
    </div>
  );
}
