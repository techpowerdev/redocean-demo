import { SquarePen, Trash2 } from "lucide-react";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import { ConfirmationPopup } from "@/components/shared/ConfirmationPopup";
import { useState } from "react";
import {
  deleteProductItem,
  getAllProductItems,
} from "@/services/productServices";
import ActionToolbar from "@/app/(admin)/admin/components/shared/ActionToolbar";
import { useRouter } from "next/navigation";

export function ProductRightActionToolbar() {
  // global state
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const selectProduct = useProductStore((state) => state.selectProduct);
  const setProductLists = useProductStore((state) => state.setProductLists);

  // local state
  const [openDeleteForm, setOpenDeleteForm] = useState(false);

  const handleOpenDeleteForm = () => {
    setOpenDeleteForm(!openDeleteForm);
  };

  const handleDelete = async () => {
    try {
      await deleteProductItem(selectedProduct?.id || "");
      const newProducts = await getAllProductItems();
      selectProduct(null);
      setProductLists(newProducts.data);
    } catch (error) {
      console.error("error", error);
    }
  };

  // navigation
  const router = useRouter();

  return (
    <>
      <ConfirmationPopup
        title="ต้องการลบสินค้านี้?"
        open={openDeleteForm}
        setOpen={handleOpenDeleteForm}
        action={handleDelete}
      />

      {/* actions */}
      <ActionToolbar
        selectedItem={selectedProduct}
        actions={[
          {
            icon: <SquarePen className="h-4 w-4" />,
            tooltip: "แก้ไข",
            onClick: () =>
              router.push(`/admin/product/edit/${selectedProduct?.id}`),
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
