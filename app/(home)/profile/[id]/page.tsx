import { EditProfileForm } from "@/app/features/profile/forms/EditProfileForm";
import { getCurrentUser } from "@/services/authServices";

type Props = {
  params: { id: string };
};

export default async function page({ params }: Props) {
  const profile = await getCurrentUser();

  if (!profile || !profile.data) {
    <div>ไม่พบข้อมูลผู้ใช้งาน</div>;
  }

  return (
    <div className="max-w-screen-sm mx-auto p-4 rounded-md shadow-md mt-4">
      <EditProfileForm user={profile.data} />
    </div>
  );
}
