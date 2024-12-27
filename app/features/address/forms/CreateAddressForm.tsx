// "use client";

// import dynamic from "next/dynamic";
// import React, { useState } from "react";

// // Dynamically import the full typeahead module for client-side only
// const ThailandAddressTypeahead = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then(
//       (mod) => mod.ThailandAddressTypeahead
//     ),
//   { ssr: false }
// );

// const SubdistrictInput = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then(
//       (mod) => mod.SubdistrictInput
//     ),
//   { ssr: false }
// );

// const DistrictInput = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then((mod) => mod.DistrictInput),
//   { ssr: false }
// );

// const ProvinceInput = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then((mod) => mod.ProvinceInput),
//   { ssr: false }
// );

// const PostalCodeInput = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then(
//       (mod) => mod.PostalCodeInput
//     ),
//   { ssr: false }
// );

// const Suggestion = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then((mod) => mod.Suggestion),
//   { ssr: false }
// );

// const AutocompleteAddressForm = dynamic(
//   async () => {
//     const { ThailandAddressValue } = await import(
//       "react-thailand-address-typeahead"
//     );

//     return function Form() {
//       const [val, setVal] = useState(ThailandAddressValue.empty());

//       return (
//         <ThailandAddressTypeahead
//           value={val}
//           onValueChange={(val) => setVal(val)}
//         >
//           <div className="space-y-2">
//             <SubdistrictInput
//               placeholder="ตำบล / แขวง"
//               className="w-full p-2 border rounded-sm"
//             />
//             <DistrictInput
//               placeholder="อำเภอ / เขต"
//               className="w-full p-2 border rounded-sm"
//             />
//             <ProvinceInput
//               placeholder="จังหวัด"
//               className="w-full p-2 border rounded-sm"
//             />
//             <PostalCodeInput
//               placeholder="รหัสไปรษณีย์"
//               className="w-full p-2 border rounded-sm"
//             />
//             <Suggestion
//               containerProps={{
//                 className:
//                   "flex flex-col border rounded-sm shadow-md mt-1 divide-y",
//               }}
//               optionItemProps={{
//                 className: "cursor-pointer p-2 hover:bg-slate-100",
//               }}
//             />
//           </div>
//         </ThailandAddressTypeahead>
//       );
//     };
//   },
//   { ssr: false }
// );

// export default AutocompleteAddressForm;
// "use client";

// import dynamic from "next/dynamic";
// import React, { useState } from "react";
// import { z } from "zod";
// import axios from "axios";

// // Dynamically import the full typeahead module for client-side only
// const ThailandAddressTypeahead = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then(
//       (mod) => mod.ThailandAddressTypeahead
//     ),
//   { ssr: false }
// );

// const SubdistrictInput = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then(
//       (mod) => mod.SubdistrictInput
//     ),
//   { ssr: false }
// );

// const DistrictInput = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then((mod) => mod.DistrictInput),
//   { ssr: false }
// );

// const ProvinceInput = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then((mod) => mod.ProvinceInput),
//   { ssr: false }
// );

// const PostalCodeInput = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then(
//       (mod) => mod.PostalCodeInput
//     ),
//   { ssr: false }
// );

// const Suggestion = dynamic(
//   () =>
//     import("react-thailand-address-typeahead").then((mod) => mod.Suggestion),
//   { ssr: false }
// );

// const AutocompleteAddressForm = dynamic(
//   async () => {
//     // const { ThailandAddressValue } = await import(
//     //   "react-thailand-address-typeahead"
//     // );

//     // Define validation schema with zod
//     const AddressSchema = z.object({
//       recipient: z
//         .string()
//         .min(1, "กรุณากรอกชื่อผู้รับ")
//         .refine((value) => value.trim() !== "", "กรุณากรอกชื่อผู้รับ"),
//       phoneNumber: z
//         .string({
//           required_error: "กรุณากรอกเบอร์โทร", // ใช้ข้อความนี้เมื่อฟิลด์ว่าง
//         })
//         .nonempty({ message: "กรุณากรอกเบอร์โทร" }) // ตรวจสอบให้แน่ใจว่าฟิลด์ไม่ว่าง
//         .regex(/^0[0-9]{9}$/, { message: "กรุณากรอกเบอร์โทร" }), //ตรวจสอบรูปแบบเบอร์โทร
//       address: z
//         .string()
//         .min(1, "กรุณากรอกที่อยู่")
//         .refine((value) => value.trim() !== "", "กรุณากรอกที่อยู่"),
//       street: z.string().optional(),
//       subdistrict: z
//         .string()
//         .min(1, "กรุณากรอกอำเภอ / เขต")
//         .refine(
//           (value) => value.trim() !== "",
//           "กรุณากรอกอำเภอ / เขต"
//         ),
//       district: z
//         .string()
//         .min(1, "กรุณากรอกอำเภอ / เขต")
//         .refine(
//           (value) => value.trim() !== "",
//           "กรุณากรอกอำเภอ / เขต"
//         ),
//       province: z
//         .string()
//         .min(1, "กรุณากรอกจังหวัด")
//         .refine((value) => value.trim() !== "", "กรุณากรอกจังหวัด"),
//       postalCode: z
//         .string()
//         .regex(/^\d{5}$/, "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก")
//         .refine(
//           (value) => value.trim() !== "",
//           "กรุณากรอกรหัสไปรษณีย์"
//         ),
//     });

//     return function Form() {
//       // const [val, setVal] = useState(ThailandAddressValue.empty());
//       const [val, setVal] = useState({
//         recipient: "",
//         phoneNumber: "",
//         address: "",
//         street: "",
//         subdistrict: "",
//         district: "",
//         province: "",
//         postalCode: "",
//       });
//       const [errors, setErrors] = useState<Record<string, string>>({});

//       const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();

//         // Validate the form values
//         const formData = {
//           recipient: val.recipient,
//           phoneNumber: val.phoneNumber,
//           address: val.address,
//           street: val.street,
//           subdistrict: val.subdistrict,
//           district: val.district,
//           province: val.province,
//           postalCode: val.postalCode,
//         };

//         try {
//           console.log(formData); // Validation passes
//           AddressSchema.parse(formData); // Validation passes
//           setErrors({}); // Clear errors if valid

//           // Send data via axios
//           await axios.post("/api/submit-address", formData);
//           alert("ส่งข้อมูลสำเร็จ!");
//         } catch (err) {
//           // Collect validation errors
//           if (err instanceof z.ZodError) {
//             const errorMessages: Record<string, string> = {};
//             err.errors.forEach((e) => {
//               if (e.path[0]) {
//                 errorMessages[e.path[0]] = e.message;
//               }
//             });
//             setErrors(errorMessages);
//           }
//         }
//       };

//       return (
//         <form onSubmit={handleSubmit}>
//           <ThailandAddressTypeahead
//             value={val}
//             onValueChange={(val) =>
//               setVal({
//                 ...val,
//                 recipient: "",
//                 phoneNumber: "",
//                 address: "",
//                 street: "",
//               })
//             }
//           >
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="ชื่อผู้รับ"
//                 className="w-full p-2 border rounded-sm"
//                 value={val.recipient || ""}
//                 onChange={(e) =>
//                   setVal({
//                     ...val,
//                     recipient: e.target.value,
//                   })
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="เบอร์โทรผู้รับ"
//                 className="w-full p-2 border rounded-sm"
//                 value={val.phoneNumber || ""}
//                 onChange={(e) =>
//                   setVal({
//                     ...val,
//                     phoneNumber: e.target.value,
//                   })
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="ที่อยู่ / อาคาร"
//                 className="w-full p-2 border rounded-sm"
//                 value={val.address || ""}
//                 onChange={(e) =>
//                   setVal({
//                     ...val,
//                     address: e.target.value,
//                   })
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="ถนน / ซอย"
//                 className="w-full p-2 border rounded-sm"
//                 value={val.street || ""}
//                 onChange={(e) =>
//                   setVal({
//                     ...val,
//                     street: e.target.value,
//                   })
//                 }
//               />
//               <div>
//                 <SubdistrictInput
//                   placeholder="ตำบล / แขวง"
//                   className="w-full p-2 border rounded-sm"
//                 />
//                 {errors.subdistrict && (
//                   <p className="text-red-500 text-sm">{errors.subdistrict}</p>
//                 )}
//               </div>
//               <div>
//                 <DistrictInput
//                   placeholder="อำเภอ / เขต"
//                   className="w-full p-2 border rounded-sm"
//                 />
//                 {errors.district && (
//                   <p className="text-red-500 text-sm">{errors.district}</p>
//                 )}
//               </div>
//               <div>
//                 <ProvinceInput
//                   placeholder="จังหวัด"
//                   className="w-full p-2 border rounded-sm"
//                 />
//                 {errors.province && (
//                   <p className="text-red-500 text-sm">{errors.province}</p>
//                 )}
//               </div>
//               <div>
//                 <PostalCodeInput
//                   placeholder="รหัสไปรษณีย์"
//                   className="w-full p-2 border rounded-sm"
//                 />
//                 {errors.postalCode && (
//                   <p className="text-red-500 text-sm">{errors.postalCode}</p>
//                 )}
//               </div>
//               <Suggestion
//                 containerProps={{
//                   className:
//                     "flex flex-col border rounded-sm shadow-md mt-1 divide-y",
//                 }}
//                 optionItemProps={{
//                   className: "cursor-pointer p-2 hover:bg-slate-100",
//                 }}
//               />
//             </div>
//             {JSON.stringify(val)}
//             <button
//               type="submit"
//               className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//             >
//               ส่งข้อมูล
//             </button>
//           </ThailandAddressTypeahead>
//         </form>
//       );
//     };
//   },
//   { ssr: false }
// );

// export default AutocompleteAddressForm;

"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import axios from "axios";
import { CirclePlus } from "lucide-react";
import { useAddressStore } from "@/state-stores/addressStore";

// Dynamically import the typeahead components
const ThailandAddressTypeahead = dynamic(
  () =>
    import("react-thailand-address-typeahead").then(
      (mod) => mod.ThailandAddressTypeahead
    ),
  { ssr: false }
);
const SubdistrictInput = dynamic(
  () =>
    import("react-thailand-address-typeahead").then(
      (mod) => mod.SubdistrictInput
    ),
  { ssr: false }
);
const DistrictInput = dynamic(
  () =>
    import("react-thailand-address-typeahead").then((mod) => mod.DistrictInput),
  { ssr: false }
);
const ProvinceInput = dynamic(
  () =>
    import("react-thailand-address-typeahead").then((mod) => mod.ProvinceInput),
  { ssr: false }
);
const PostalCodeInput = dynamic(
  () =>
    import("react-thailand-address-typeahead").then(
      (mod) => mod.PostalCodeInput
    ),
  { ssr: false }
);
const Suggestion = dynamic(
  () =>
    import("react-thailand-address-typeahead").then((mod) => mod.Suggestion),
  { ssr: false }
);

const AddressSchema = z.object({
  recipient: z
    .string()
    .min(1, "กรุณากรอกชื่อผู้รับ")
    .refine((value) => value.trim() !== "", "กรุณากรอกชื่อผู้รับ"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^0[0-9]{9}$/, "กรุณากรอกเบอร์โทร"),
  address: z
    .string()
    .min(1, "กรุณากรอกที่อยู่")
    .refine((value) => value.trim() !== "", "กรุณากรอกที่อยู่"),
  street: z.string().optional(),
  subdistrict: z
    .string()
    .min(1, "กรุณากรอกตำบล / แขวง")
    .refine((value) => value.trim() !== "", "กรุณากรอกตำบล / แขวง"),
  district: z
    .string()
    .min(1, "กรุณากรอกอำเภอ / เขต")
    .refine((value) => value.trim() !== "", "กรุณากรอกอำเภอ / เขต"),
  province: z
    .string()
    .min(1, "กรุณากรอกจังหวัด")
    .refine((value) => value.trim() !== "", "กรุณากรอกจังหวัด"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก")
    .refine((value) => value.trim() !== "", "กรุณากรอกรหัสไปรษณีย์"),
  isActive: z.boolean().default(false).optional(),
});

export default function CreateAddressForm() {
  // global state
  const createAddress = useAddressStore((state) => state.createAddress);
  const [val, setVal] = useState({
    recipient: "",
    phoneNumber: "",
    address: "",
    street: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
    isActive: false,
  });

  // local state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      AddressSchema.parse(val); // Validate form values
      setErrors({}); // Clear errors if valid

      setLoading(true);

      const formData = {
        recipient: val.recipient,
        phoneNumber: val.phoneNumber,
        address: val.address,
        street: val.street,
        subDistrict: val.subdistrict,
        district: val.district,
        province: val.province,
        postalCode: val.postalCode,
        isActive: val.isActive,
      };

      await createAddress(formData);
      setVal({
        recipient: "",
        phoneNumber: "",
        address: "",
        street: "",
        subdistrict: "",
        district: "",
        province: "",
        postalCode: "",
        isActive: false,
      });
      setLoading(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages: Record<string, string> = {};
        error.errors.forEach((e) => {
          if (e.path[0]) {
            errorMessages[e.path[0]] = e.message;
          }
        });
        setErrors(errorMessages);
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response?.data.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.entries(errors).length > 0) {
      toast.error("กรุณาตรวจสอบข้อมูลอีกครั้ง");
    }
  }, [errors]);
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <CirclePlus size={24} />
          เพิ่มที่อยู่ใหม่
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>เพิ่มที่อยู่</DrawerTitle>
            <DrawerDescription>กรอกข้อมูลที่อยู่ให้ครบถ้วน</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <ScrollArea className="h-[calc(100vh-350px)] px-4">
              <ThailandAddressTypeahead
                value={val}
                onValueChange={(updatedValue) => {
                  setVal((prev) => ({
                    ...prev,
                    subdistrict: updatedValue.subdistrict,
                    district: updatedValue.district,
                    province: updatedValue.province,
                    postalCode: updatedValue.postalCode,
                  }));
                }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="ชื่อผู้รับ"
                    className="w-full p-2 border rounded-sm"
                    value={val.recipient}
                    onChange={(e) =>
                      setVal({ ...val, recipient: e.target.value })
                    }
                  />
                  {errors.recipient && (
                    <p className="text-red-500 text-sm">{errors.recipient}</p>
                  )}
                  <input
                    type="text"
                    placeholder="เบอร์โทรผู้รับ"
                    className="w-full p-2 border rounded-sm"
                    value={val.phoneNumber}
                    onChange={(e) =>
                      setVal({ ...val, phoneNumber: e.target.value })
                    }
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                  )}
                  <input
                    type="text"
                    placeholder="ที่อยู่ / อาคาร"
                    className="w-full p-2 border rounded-sm"
                    value={val.address}
                    onChange={(e) =>
                      setVal({ ...val, address: e.target.value })
                    }
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                  <input
                    type="text"
                    placeholder="ถนน / ซอย"
                    className="w-full p-2 border rounded-sm"
                    value={val.street}
                    onChange={(e) => setVal({ ...val, street: e.target.value })}
                  />
                  <SubdistrictInput
                    placeholder="ตำบล / แขวง"
                    className="w-full p-2 border rounded-sm"
                  />
                  {errors.subdistrict && (
                    <p className="text-red-500 text-sm">{errors.subdistrict}</p>
                  )}
                  <DistrictInput
                    placeholder="อำเภอ / เขต"
                    className="w-full p-2 border rounded-sm"
                  />
                  {errors.district && (
                    <p className="text-red-500 text-sm">{errors.district}</p>
                  )}
                  <ProvinceInput
                    placeholder="จังหวัด"
                    className="w-full p-2 border rounded-sm"
                  />
                  {errors.province && (
                    <p className="text-red-500 text-sm">{errors.province}</p>
                  )}
                  <PostalCodeInput
                    placeholder="รหัสไปรษณีย์"
                    className="w-full p-2 border rounded-sm"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm">{errors.postalCode}</p>
                  )}
                  <Suggestion
                    // containerProps={{ className: "flex flex-col mt-2" }}
                    containerProps={{
                      className:
                        "flex flex-col border rounded-sm shadow-md mt-1 divide-y",
                    }}
                    optionItemProps={{
                      className: "cursor-pointer p-2 hover:bg-slate-100",
                    }}
                  />
                  <label className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={val.isActive}
                      onChange={(e) =>
                        setVal({ ...val, isActive: e.target.checked })
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    ตั้งเป็นที่อยู่หลัก
                  </label>
                </div>
              </ThailandAddressTypeahead>
            </ScrollArea>
            <DrawerFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">ยกเลิก</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
