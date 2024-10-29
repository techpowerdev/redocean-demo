// // -------version 1
// "use client";
// import {
//   Mail,
//   MapPinHouse,
//   Phone,
//   Power,
//   SquarePen,
//   UserRoundPen,
// } from "lucide-react";
// import Image from "next/image";
// import React, { useEffect } from "react";
// import { useUser } from "@/hooks/useUser";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import Loading from "@/components/shared/Loading";
// import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
// import { EditProfile } from "./EditProfile";
// // import OTPDialog from "@/components/auth/OTPDialog";
// // import useAuthStore from "@/state-stores/useAuthStore";

// export default function Profile() {
//   const router = useRouter();

//   const { user, loading, liffLogout } = useUser(); // ดึงค่า loading ด้วย
//   const { currentUser } = useCurrentUserStore();
//   // ตรวจสอบสถานะ loading และค่า user
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login"); // redirect เมื่อ user เป็น null หลังจากโหลดเสร็จ
//       toast.error("กรุณาเชื่อมต่อไลน์");
//     }
//   }, [loading, user, router]);

//   // const { user, isVerified } = useAuthStore();
//   // const { isVerified } = useAuthStore();
//   // const [showDialog, setShowDialog] = useState(false);

//   // useEffect(() => {
//   //   if (user && !isVerified) {
//   //     setShowDialog(true); // แสดง dialog ถ้า user ยังไม่ได้ verified
//   //   }
//   // }, [user, isVerified, router]);

//   if (loading) {
//     return (
//       <div className="fixed top-0 left-0 w-full h-screen justify-center items-center">
//         <Loading size={40} />
//       </div>
//     );
//   }
//   return (
//     <>
//       {/* {showDialog && <OTPDialog onClose={() => setShowDialog(false)} />} */}
//       <div className="px-2 flex flex-col items-center">
//         {currentUser?.id}
//         <div className="flex gap-2 items-center mb-4">
//           {user?.pictureUrl && (
//             <Image
//               className="h-12 w-12 rounded-full border-2 border-primary"
//               src={user.pictureUrl}
//               alt={user.name}
//               width={48}
//               height={48}
//             />
//           )}
//           <span>{user?.name}</span>
//         </div>
//         <div className="rounded-xl border bg-card text-card-foreground shadow">
//           <div className="flex justify-between gap-2 items-center p-6 pb-3">
//             <h3 className="font-semibold leading-none tracking-tight">
//               ข้อมูลส่วนตัว
//             </h3>
//             <div>
//               <EditProfile />
//             </div>
//           </div>
//           <div className="p-6 pt-0 grid gap-1">
//             <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all">
//               <MapPinHouse />
//               <div className="space-y-1">
//                 <p className="text-sm font-medium leading-none">ที่อยู่</p>
//                 <p className="text-sm text-muted-foreground">
//                   859/1 เจริญนคร 14 แยก 20 คลองสานไทร คลองสาน กรุงเทพ
//                 </p>
//               </div>
//             </div>
//             <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 text-accent-foreground transition-all">
//               <UserRoundPen />
//               <div className="space-y-1">
//                 <p className="text-sm font-medium leading-none">ชื่อ-สกุล</p>
//                 <p className="text-sm text-muted-foreground">Red Ocean</p>
//               </div>
//             </div>
//             <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all">
//               <Phone />
//               <div className="space-y-1">
//                 <p className="text-sm font-medium leading-none">เบอร์โทร</p>
//                 <p className="text-sm text-muted-foreground">0899999999</p>
//               </div>
//             </div>
//             <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all">
//               <Mail />
//               <div className="space-y-1">
//                 <p className="text-sm font-medium leading-none">อีเมล</p>
//                 <p className="text-sm text-muted-foreground">
//                   redocean@admin.com
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end p-2">
//             <Button
//               onClick={liffLogout}
//               variant={"outline"}
//               className="flex gap-1 hover:text-primary rounded-full"
//             >
//               <Power size={15} />
//               ออกจากระบบ
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // --------- end of version 1

// -------version 2
"use client";
import { Mail, Phone, Power, UserRoundPen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Loading from "@/components/shared/Loading";
import { EditProfile } from "./EditProfile";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import liff from "@line/liff";
import LineLogin from "@/components/auth/LineLogin";
import MobileContainer from "@/components/shared/MobileContainer";

export default function Profile() {
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  const clearCurrentUser = useCurrentUserStore(
    (state) => state.clearCurrentUser
  );

  const loading = useCurrentUserStore((state) => state.loading);

  // logout
  const logout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      clearCurrentUser();
      // localStorage.removeItem("LoggedInUser");
      toast.success("ออกจากระบบแล้ว");
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen justify-center items-center">
        <Loading size={40} />
      </div>
    );
  }

  return (
    <MobileContainer>
      {currentUser ? (
        <div className="px-2 flex flex-col items-center">
          <div className="flex gap-2 items-center mb-4">
            {currentUser?.pictureUrl && (
              <Image
                className="h-12 w-12 rounded-full border-2 border-primary"
                src={currentUser.pictureUrl}
                alt={currentUser.displayName || ""}
                width={48}
                height={48}
              />
            )}
            <span>{currentUser?.displayName}</span>
          </div>
          <div className="w-full rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex justify-between gap-2 items-center p-6 pb-3">
              <h3 className="font-semibold leading-none tracking-tight">
                ข้อมูลส่วนตัว
              </h3>
              <div>
                <EditProfile />
              </div>
            </div>
            <div className="w-full p-6 pt-0 grid gap-1">
              {/* <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all">
                <MapPinHouse />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">ที่อยู่</p>
                  <p className="text-sm text-muted-foreground">
                    859/1 เจริญนคร 14 แยก 20 คลองสานไทร คลองสาน กรุงเทพ
                  </p>
                </div>
              </div> */}
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 text-accent-foreground transition-all">
                <UserRoundPen />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">ชื่อ-สกุล</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.fullName}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all">
                <Phone />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">เบอร์โทร</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all">
                <Mail />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">อีเมล</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-2">
              <Button
                onClick={logout}
                variant={"outline"}
                className="flex gap-1 hover:text-primary rounded-full"
              >
                <Power size={15} />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <LineLogin />
      )}
    </MobileContainer>
  );
}

// --------- end of version 2

// <div className="px-2 flex flex-col items-center">

// </div>
