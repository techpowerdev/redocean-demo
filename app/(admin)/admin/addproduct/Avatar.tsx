import Image from "next/image";
import { FaCircleUser } from "react-icons/fa6";

interface AvatarProps {
  src?: string | null | undefined;
}

export default function Avatar({ src }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        className="rounded-full"
        height={30}
        width={30}
      />
    );
  }
  return <FaCircleUser size={24} />;
}
