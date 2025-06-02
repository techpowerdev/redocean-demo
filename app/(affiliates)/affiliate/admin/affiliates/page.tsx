"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAllAffiliates,
  searchAffiliates,
} from "@/services/affiliateServices";
import {
  GetAllAffiliatesResponse,
  SearchAffiliatesResponse,
} from "@/types/affiliateTypes";
import { formatDateTimePromotion } from "@/utils/formatDate";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import SearchForm from "@/components/shared/SearchForm";

export default function Affiliates() {
  const [affiliates, setAffiliates] = useState<
    GetAllAffiliatesResponse["data"]
  >([]);

  const [searchResults, setSearchResults] = useState<
    SearchAffiliatesResponse["data"]
  >([]);

  const { toast } = useToast();

  const pendingAffiliates = affiliates.filter(
    (affiliate) => affiliate.status === "pending"
  );

  const approvedAffiliates = affiliates.filter(
    (affiliate) => affiliate.status === "approved"
  );

  const rejectedAffiliates = affiliates.filter(
    (affiliate) => affiliate.status === "rejected"
  );

  const handleSearch = async (keyword: string) => {
    try {
      const results = await searchAffiliates(keyword);
      if (results.data.length > 0) {
        setSearchResults(results.data);
      } else {
        toast({
          variant: "destructive",
          title: "ผลการค้นหา",
          description: "ไม่พบข้อมูล",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const affiliates = await getAllAffiliates();
      if (affiliates.data) {
        setAffiliates(affiliates.data);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">จัดการ Affiliates</h1>
        <SearchForm
          onSearch={handleSearch}
          placeHolder="ค้นหาด้วยชื่อ หรือ อีเมล"
        />
      </div>
      {searchResults.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-500">ผลการค้นหา</CardTitle>
            <CardDescription>รายการ Affiliates ทั้งหมดที่พบ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults?.map((affiliate) => (
                <div key={affiliate.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      {/* <Avatar>
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="Sofia Davis"
                      />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar> */}
                      <div>
                        <h3 className="font-medium">
                          {affiliate.firstName + " " + affiliate.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {affiliate.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-4">
                        {/* <div className="text-sm">
                      <div>ยอดขาย: 156</div>
                      <div>รายได้: ฿12,450</div>
                    </div> */}
                        <div className="text-sm">
                          <div>
                            วันที่เข้าร่วม:{" "}
                            {formatDateTimePromotion(affiliate.createdAt)}
                          </div>
                          <div>
                            สถานะ:{" "}
                            <span className="text-green-500">
                              {affiliate.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/affiliate/admin/affiliates/${affiliate.id}`}
                        className="w-full md:w-fit text-center text-xs font-medium border px-3 py-2 rounded-md hover:bg-gray-50"
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
      <Tabs
        defaultValue="pending"
        // value={activeTab}
        // onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="pending">คำขอใหม่</TabsTrigger>
          <TabsTrigger value="approved">กำลังใช้งานอยู่</TabsTrigger>
          <TabsTrigger value="rejected">ถูกปฏิเสธ</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-500">
                คำขอเป็น Affiliate ใหม่ ({pendingAffiliates.length})
              </CardTitle>
              <CardDescription>
                รายการคำขอเป็น Affiliate ที่รอการอนุมัติ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAffiliates?.map((affiliate) => (
                  <div key={affiliate.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        {/* <Avatar>
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="John Smith"
                      />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar> */}
                        <div>
                          <h3 className="font-medium">
                            {affiliate.firstName + " " + affiliate.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {affiliate.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        สมัครเมื่อ{" "}
                        {formatDateTimePromotion(affiliate.createdAt)}
                      </div>
                      <Link
                        href={`/affiliate/admin/affiliates/${affiliate.id}`}
                        className="text-center text-xs font-medium border px-3 py-2 rounded-md hover:bg-gray-50"
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-500">
                Affiliates ที่ใช้งานอยู่ ({approvedAffiliates.length})
              </CardTitle>
              <CardDescription>รายการ Affiliates ทั้งหมดในระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedAffiliates?.map((affiliate) => (
                  <div key={affiliate.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        {/* <Avatar>
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="Sofia Davis"
                      />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar> */}
                        <div>
                          <h3 className="font-medium">
                            {affiliate.firstName + " " + affiliate.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {affiliate.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex md:flex-col justify-between items-center md:items-end flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                          {/* <div className="text-sm">
                      <div>ยอดขาย: 156</div>
                      <div>รายได้: ฿12,450</div>
                    </div> */}
                          <div className="text-sm">
                            <div>
                              วันที่เข้าร่วม:{" "}
                              {formatDateTimePromotion(affiliate.createdAt)}
                            </div>
                            <div>
                              สถานะ:{" "}
                              <span className="text-green-500">
                                {affiliate.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/affiliate/admin/affiliates/${affiliate.id}`}
                          className="w-full md:w-fit text-center text-xs font-medium border px-3 py-2 rounded-md hover:bg-gray-50"
                        >
                          ดูรายละเอียด
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">
                Affiliates ที่ถูกปฏิเสธ ({rejectedAffiliates.length})
              </CardTitle>
              <CardDescription>
                รายการ Affiliates ทั้งหมดที่ถูกปฏิเสธคำขอสมัครเป็น affiliate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rejectedAffiliates?.map((affiliate) => (
                  <div key={affiliate.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        {/* <Avatar>
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="Sofia Davis"
                      />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar> */}
                        <div>
                          <h3 className="font-medium">
                            {affiliate.firstName + " " + affiliate.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {affiliate.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex md:flex-col justify-between items-center md:items-end flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                          {/* <div className="text-sm">
                      <div>ยอดขาย: 156</div>
                      <div>รายได้: ฿12,450</div>
                    </div> */}
                          <div className="text-sm">
                            <div>
                              วันที่เข้าร่วม:{" "}
                              {formatDateTimePromotion(affiliate.createdAt)}
                            </div>
                            <div>
                              สถานะ:{" "}
                              <span className="text-green-500">
                                {affiliate.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/affiliate/admin/affiliates/${affiliate.id}`}
                          className="w-full md:w-fit text-center text-xs font-medium border px-3 py-2 rounded-md hover:bg-gray-50"
                        >
                          ดูรายละเอียด
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
