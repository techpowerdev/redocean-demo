"use client";

import { categories } from "@/utils/categories";
import { colors } from "@/utils/colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Heading from "./Heading";
import Input from "./inputs/Input";
import TextArea from "./inputs/TextArea";
import CustomCheckBox from "./inputs/CustomCheckBox";
import CategoryInput from "./inputs/CategoryInput";
import SelectColor from "./inputs/SelectColor";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

export default function AddProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);

  // const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error("Category is not selected");
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error("No selected image!");
    }

    // const handleImageUploads = async () => {
    //   toast("Creating product, please wait...");
    //   try {
    //     for (const item of data.images) {
    //       // console.log(item);
    //       // try {
    //       //   const responseImage = axios.post(
    //       //     `${process.env.NEXT_PUBLIC_API_URL}/uploadImages`,
    //       //     item,
    //       //     {
    //       //       headers: {
    //       //         "Content-Type": "multipart/form-data",
    //       //       },
    //       //     }
    //       //   );
    //       //   console.log("responseImage", responseImage);
    //       // } catch (error) {
    //       //   console.log(error);
    //       // }
    //       // upload image to firebase
    //       // if (item.image) {
    //       //   const fileName = new Date().getTime() + "-" + item.image.name;
    //       //   // Initialize Cloud Storage and get a reference to the service
    //       //   const storage = getStorage(firebaseApp);
    //       //   // for use Emulator in test mode
    //       //   if (location.hostname === "localhost") {
    //       //     // Point to the Storage emulator running on localhost.
    //       //     connectStorageEmulator(storage, "127.0.0.1", 9199);
    //       //   } // comment this if state when your want to use storage in production
    //       //   const storageRef = ref(storage, `products/${fileName}`);
    //       //   const uploadTask = uploadBytesResumable(storageRef, item.image);
    //       //   await new Promise<void>((resolve, reject) => {
    //       //     uploadTask.on(
    //       //       "state_changed",
    //       //       (snapshot) => {
    //       //         // Observe state change events such as progress, pause, and resume
    //       //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //       //         const progress =
    //       //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       //         console.log("Upload is " + progress + "% done");
    //       //         switch (snapshot.state) {
    //       //           case "paused":
    //       //             console.log("Upload is paused");
    //       //             break;
    //       //           case "running":
    //       //             console.log("Upload is running");
    //       //             break;
    //       //         }
    //       //       },
    //       //       (error) => {
    //       //         console.log("Error Uploading image", error);
    //       //         reject(error);
    //       //       },
    //       //       () => {
    //       //         // Handle successful uploads on complete
    //       //         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //       //         getDownloadURL(uploadTask.snapshot.ref)
    //       //           .then((downloadURL) => {
    //       //             uploadedImages.push({
    //       //               ...item,
    //       //               image: downloadURL,
    //       //             });
    //       //             console.log("File available at", downloadURL);
    //       //             resolve();
    //       //           })
    //       //           .catch((error) => {
    //       //             console.log("Error getting the download URL", error);
    //       //             reject(error);
    //       //           });
    //       //       }
    //       //     );
    //       //   });
    //       // }
    //     }
    //   } catch (error) {
    //     setIsLoading(false);
    //     console.log("Error handling image uploads");
    //     return toast.error("Error handling image uploads");
    //   }
    // };
    // await handleImageUploads();

    /*FormData เป็นอ็อบเจ็กต์ใน JavaScript ที่ใช้สำหรับสร้างชุดข้อมูลแบบฟอร์มเพื่อส่งไปยังเซิร์ฟเวอร์ โดยเฉพาะเมื่อต้องการส่งข้อมูลประเภท multipart/form-data เช่น การอัปโหลดไฟล์และข้อมูลอื่นๆ
     */
    const formData = new FormData();

    // เพิ่มไฟล์ลงใน FormData
    data.images.forEach((image: any) => {
      formData.append("images", image.image);
    });

    // ใช้ Object.entries เพื่อเพิ่มฟิลด์ข้อมูลอื่นๆ
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "images") {
        // ยกเว้นฟิลด์ images เพราะเราได้เพิ่มไปแล้ว
        formData.append(key, value);
      }
    });

    // แสดงข้อมูลใน form
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    const responseImage = axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/uploadImages`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const productData = { ...data, images: uploadedImages };
    console.log("productData", productData);

    // save product to mongodb
    // axios
    //   .post("/api/product", productData)
    //   .then(() => {
    //     toast.success("Product created");
    //     setIsProductCreated(true);
    //     router.refresh();
    //   })
    //   .catch((error) => {
    //     toast.error("Something went wrong when saving product to db");
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  const category = watch("category");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter(
          (item) => item.color !== value.color
        );
        return filteredImages;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    setCustomValue("images", images);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  return (
    <>
      <Heading title="Add a Product" center />
      <Input
        id="name"
        label="name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="price"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
        required
      />

      <Input
        id="brand"
        label="brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckBox
        id="inStock"
        label="This product is in stock"
        disabled={isLoading}
        register={register}
      />
      <div className="w-full font-semibold">
        <div className="mb-2 font-normal">Select a Category</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 max-h-[50vh] overflow-y-auto">
          {categories.map((item) => {
            if (item.label === "All") {
              return null;
            }
            return (
              <div key={item.label} className="col-span">
                <CategoryInput
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-medium">
            Select the available product colors and upload their images.
          </div>
          <div className="text-sm">
            You must upload an image for each of the color selected otherwise
            your color selection will be ignored.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((item, index) => {
            return (
              <SelectColor
                key={index}
                item={item}
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProductCreated={isProductCreated}
              />
            );
          })}
        </div>
      </div>
      <button
        onClick={handleSubmit(onSubmit)}
        className="btn btn-sm btn-primary"
      >
        {isLoading ? "Loading" : "Add Product"}
      </button>
    </>
  );
}
