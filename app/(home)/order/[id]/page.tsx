// import OrderList from "./OrderList";
// import { getOneOrder } from "@/actions/getOrder";
// import moment from "moment";
// import Image from "next/image";
// import { formatPrice } from "@/utils/formatPrice";
// import { truncateText } from "@/utils/truncateText";
// import Container from "@/components/shared/Container";
// import Heading from "@/components/shared/Heading";

// export default async function page({ params }: { params: { id: string } }) {
//   const data = await getOneOrder(params.id);

//   return (
//     <div className="py-8">
//       <Container>
//         <Heading title="OrderDetails" />
//         <h3 className="mt8">OrderID : {data?.id}</h3>
//         <h3>Total Amount : {data?.amount ? formatPrice(data.amount) : ""}</h3>
//         <h3>Payment status : {data?.status}</h3>
//         <h3>Delivery status : {data?.deliveryStatus}</h3>
//         <h3>Date : {moment(data?.createDate).fromNow()}</h3>
//         <div>
//           <h1 className="mt-8 font-normal">Products Ordered</h1>
//           <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 border-b-2 py-2 font-light">
//             <div>PRODUCT</div>
//             <div>PRICE</div>
//             <div className="text-center">QUANTITY</div>
//           </div>
//           <div className="divide-y">
//             {data?.products.map((product: any) => (
//               <div
//                 key={product.id}
//                 className="grid grid-cols-[2fr_1fr_1fr] gap-2 py-2"
//               >
//                 <div className="flex flex-col sm:flex-row gap-6">
//                   {/* <div className="w-[20%] max-h-[500px] min-h-[300px] sm:min-h-[400px]"> */}
//                   <div
//                     className={`relative w-[30%] max-w-[150px] aspect-square rounded border-teal-300`}
//                   >
//                     <Image
//                       src={product.selectedImg.image}
//                       alt={product.name}
//                       fill
//                       className="object-contain"
//                       // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                     />
//                   </div>
//                   {/* </div> */}
//                   <div>
//                     <p>{truncateText(product.name)}</p>
//                     <p>{product.selectedImg.color}</p>
//                   </div>
//                 </div>
//                 <div>{formatPrice(product.price)}</div>
//                 <div className="text-center">{product.quantity}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// }
