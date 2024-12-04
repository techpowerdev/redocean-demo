import Image from "next/image";

interface PropTypes {
  className?: string;
  alt: string;
  src: string;
}
export default function ResponsiveImage({ className, alt, src }: PropTypes) {
  return (
    <Image
      className={className}
      alt={alt}
      src={src}
      sizes="100vw"
      width={100}
      height={100}
      // Make the image display full width
      style={{
        width: "100%",
        height: "auto",
      }}
    />
  );
}
