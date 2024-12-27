import { Eye, SquarePen, Trash2 } from "lucide-react";
// import { ProductVariantType } from "@/types/fetchTypes";
import { useState } from "react";
import { deleteProductVariant } from "@/services/productServices";
import { DeletePopup } from "@/components/shared/DeletePopup";
import axios from "axios";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import ActionToolbar from "@/app/(admin)/admin/components/shared/ActionToolbar";
import ToggleBooleanField from "./forms/ToggleBooleanField";
import EditVariantOptions from "./forms/EditVariantOptions";
import { ProductVariantType } from "@/types/productTypes";

type Props = {
  productVariant: ProductVariantType;
};
export function ProductVariantActionToolbar({ productVariant }: Props) {
  // global state
  const setProductLists = useProductStore((state) => state.setProductLists);
  const selectProduct = useProductStore((state) => state.selectProduct);

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
    const result = await deleteProductVariant(productVariant.id);
    console.log(result);
    if (result) {
      const newProducts = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/all`
      );

      const updateSelectedProduct = newProducts.data.data.find(
        (item: ProductVariantType) => item.id === productVariant?.productId
      );

      selectProduct(updateSelectedProduct);
      setProductLists(newProducts.data.data);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center mx-2">
        <ToggleBooleanField
          initialStatus={productVariant.isActive}
          fieldName="isActive"
          icon={Eye}
          apiEndpoint={`${process.env.NEXT_PUBLIC_API_URL}/products/variants/change-status/${productVariant.id}`} // ปรับ Endpoint ให้ตรงกับสินค้า
          id={productVariant.id} // ส่งค่า ID ที่ถูกต้อง
          label="Active"
        />
      </div>
      {/* edit product form */}
      {/* <EditProductVariant
        productVariant={productVariant}
        open={openEditForm}
        setOpen={setOpenEditForm}
      /> */}

      <EditVariantOptions
        productVariant={productVariant}
        open={openEditForm}
        setOpen={setOpenEditForm}
      />

      <DeletePopup
        title="ต้องการลบตัวเลือกนี้?"
        open={openDeleteForm}
        setOpen={handleOpenDeleteForm}
        handleDelete={handleDelete}
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
