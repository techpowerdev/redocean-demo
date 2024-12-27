import { SquarePen, Trash2 } from "lucide-react";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import { EditProduct } from "./forms/EditProduct";
import { DeletePopup } from "@/components/shared/DeletePopup";
import { useState } from "react";
import { deleteProduct, getAllProducts } from "@/services/productServices";
import ActionToolbar from "@/app/(admin)/admin/components/shared/ActionToolbar";

export function ProductRightActionToolbar() {
  // global state
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const selectProduct = useProductStore((state) => state.selectProduct);
  const setProductLists = useProductStore((state) => state.setProductLists);

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
    try {
      await deleteProduct(selectedProduct?.id || "");
      const newProducts = await getAllProducts();
      selectProduct(null);
      setProductLists(newProducts.data);
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <>
      {/* edit product form */}
      <EditProduct
        openEditForm={openEditForm}
        setOpenEditForm={handleOpenForm}
        selectedProduct={selectedProduct}
      />

      <DeletePopup
        title="ต้องการลบสินค้านี้?"
        open={openDeleteForm}
        setOpen={handleOpenDeleteForm}
        handleDelete={handleDelete}
      />

      {/* actions */}
      <ActionToolbar
        selectedItem={selectedProduct}
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
