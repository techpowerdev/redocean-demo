"use client";

import PageTitle from "@/components/shared/PageTitle";
import ConfirmDeleteAction from "@/components/shared/forms/ConfirmDeleteAction";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCategory, getAllCategories } from "@/services/categoryServices";
import { GetAllCategoriesResponse } from "@/types/categoryTypes";
import { CirclePlus, Pencil } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function CategoryPage() {
  const [categories, setCategories] = useState<
    GetAllCategoriesResponse["data"]
  >([]);

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    const categories = await getAllCategories();
    setCategories(categories.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getAllCategories();
      setCategories(categories.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center gap-2 mb-4">
        <PageTitle title="หมวดหมู่สินค้า" />
        <div className="flex justify-end items-center gap-2">
          <Link href={"/admin/category/create"}>
            <Button className="bg-primary flex gap-2 items-center px-3">
              <CirclePlus />
              เพิ่มหมวดหมู่สินค้า
            </Button>
          </Link>
        </div>
      </div>
      {categories.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อหมวดหมู่</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Link href={`/admin/category/edit/${category.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDeleteAction
                        title="ยืนยันการลบหมวดหมู่"
                        description="คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้ ?"
                        action={() => handleDeleteCategory(category.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-red-500">ยังไม่มีหมวดหมู่สินค้า</div>
      )}
    </div>
  );
}
