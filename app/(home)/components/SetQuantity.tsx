// "use client";

// import { CartProductType } from "@/types/product";

// interface SetQtyProps {
//   cartCounter?: boolean;
//   cartProduct: CartProductType;
//   handleQtyIncrease: () => void;
//   handleQtyDecrease: () => void;
// }

// const btnStyles = "border-[1.2px] border-slate-300 px-2 rounded";
// export default function SetQuantity({
//   cartCounter,
//   cartProduct,
//   handleQtyIncrease,
//   handleQtyDecrease,
// }: SetQtyProps) {
//   return (
//     <div className="w-full lg:w-1/2 flex gap-6 items-center">
//       {cartCounter ? null : <div className="font-medium">จำนวน :</div>}
//       <div className="flex items-center text-base">
//         <button className={btnStyles} onClick={handleQtyDecrease}>
//           -
//         </button>
//         <div className="w-10 px-1 text-center">{cartProduct.quantity}</div>
//         <button className={btnStyles} onClick={handleQtyIncrease}>
//           +
//         </button>
//       </div>
//     </div>
//   );
// }
