import { Eye, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  deleteProductVariant,
  getAllProducts,
} from "@/services/productServices";
import { ConfirmationPopup } from "@/components/shared/ConfirmationPopup";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import ActionToolbar from "@/app/(admin)/admin/components/shared/ActionToolbar";
import EditVariantOptions from "./forms/EditVariantOptions";
import { ProductVariant } from "@/types/baseTypes";
import ChangeBooleanStatusField from "@/components/shared/ChangeBooleanStatusField";

type Props = {
  productVariant: ProductVariant;
};
export function ProductVariantActionToolbar({ productVariant }: Props) {
  // global state
  const setProductLists = useProductStore((state) => state.setProductLists);
  const selectProduct = useProductStore((state) => state.selectProduct);
  const changeVariantStatus = useProductStore(
    (state) => state.changeVariantStatus
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
    await deleteProductVariant(productVariant.id);

    const newProducts = await getAllProducts();

    const updateSelectedProduct = newProducts.data.find(
      (item) => item.id === productVariant?.productId
    );

    if (updateSelectedProduct) {
      selectProduct(updateSelectedProduct);
    }

    setProductLists(newProducts.data);
  };

  return (
    <>
      <div className="flex justify-center items-center mx-2">
        <ChangeBooleanStatusField
          initialStatus={productVariant.isActive}
          id={productVariant.id} // ส่งค่า ID ที่ถูกต้อง
          changeStatus={changeVariantStatus}
          label="Active"
          icon={Eye}
        />
      </div>

      <EditVariantOptions
        productVariant={productVariant}
        open={openEditForm}
        setOpen={setOpenEditForm}
      />

      <ConfirmationPopup
        title="ต้องการลบตัวเลือกนี้?"
        open={openDeleteForm}
        setOpen={handleOpenDeleteForm}
        action={handleDelete}
      />

      {/* actions */}
      <ActionToolbar
        selectedItem={productVariant}
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
      />
    </>
  );
}
