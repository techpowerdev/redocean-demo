"use client";

import { SquarePen, Trash2 } from "lucide-react";
import ActionToolbar from "../../components/shared/ActionToolbar";
import { DeletePopup } from "@/components/shared/DeletePopup";
import { useState } from "react";
import axios from "axios";
import { deletePromotion } from "@/services/promotionServices";
import { usePromotionStore } from "@/state-stores/admin/adminPromotionStore";
import { EditEvent } from "./EditEvent";

export function EventRightActionToolbar() {
  // global state
  const selectedPromotion = usePromotionStore(
    (state) => state.selectedPromotion
  );
  const selectPromotion = usePromotionStore((state) => state.selectPromotion);
  const setPromotionLists = usePromotionStore(
    (state) => state.setPromotionLists
  );

  // local state
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);

  const handleOpenForm = () => {
    setOpenEditForm(!openEditForm);
  };

  const handleOpenDeleteForm = () => {
    setOpenDeleteForm(!openDeleteForm);
  };

  const handleDelete = async () => {
    const result = await deletePromotion(selectedPromotion?.id || "");
    if (result) {
      const newPromotions = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/promotions/all`
      );
      selectPromotion(null);
      setPromotionLists(newPromotions.data);
    }
  };

  return (
    <>
      {/* edit Promotion form */}
      <EditEvent
        openEditForm={openEditForm}
        setOpenEditForm={handleOpenForm}
        selectedPromotion={selectedPromotion}
      />

      <DeletePopup
        title="ต้องการลบสินค้านี้?"
        open={openDeleteForm}
        setOpen={handleOpenDeleteForm}
        handleDelete={handleDelete}
      />

      {/* actions */}
      <ActionToolbar
        selectedItem={selectedPromotion}
        actions={[
          {
            icon: <SquarePen className="h-4 w-4" />,
            tooltip: "แก้ไข",
            onClick: handleOpenForm,
          },
          {
            icon: <Trash2 className="h-4 w-4" />,
            tooltip: "ลบ",
            onClick: handleOpenDeleteForm,
          },
        ]}
        // dropdownItems={[
        //   "Mark as unread",
        //   "Star thread",
        //   "Add label",
        //   "Mute thread",
        // ]}
      />
    </>
  );
}
