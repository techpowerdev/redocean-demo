import Image from "next/image";

export default function HomeBanner() {
  return (
    <div className="bg-gradient-to-r from-neutral-800 to-neutral-950">
      <div className="mx-auto px-8 py-6 flex flex-col gap-2 md:flex-row items-center justify-evenly">
        <div className="mb-8 md:mb-0 text-center">
          <h1 className="text-2xl md:text-4xl font-semibold text-white mb-4">
            Summer Sale!
          </h1>
          <p className="text-lg md:text-xl text-white mb-2">
            Enjoy discounts on selected items
          </p>
          <p className="text-xl md:text-2xl text-primary font-semibold">
            GET 60% OFF
          </p>
        </div>
        <div className="relative aspect-video w-1/5">
          <Image
            src={"/banner-image.png"}
            fill
            alt="Banner Image"
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
}
