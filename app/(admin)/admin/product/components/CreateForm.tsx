"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form valiation lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// drag and drop
import { useDropzone } from "react-dropzone";

import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { CircleAlert, CircleCheckBig, CircleX } from "lucide-react";
import Loading from "@/components/shared/Loading";
// Auth Session
// import { useSession } from "next-auth/react";

// zod schema
const formSchema = z.object({
  category: z.string({ required_error: "Category is required" }),
  location: z.string({ required_error: "Location is required" }),
  youtube: z
    .string({ required_error: "Youtube is required" })
    .trim()
    .min(1, "Youtube is required"),
  images: z
    .array(
      z.object({
        name: z.string(),
        size: z.number().max(5 * 1024 * 1024, "Max file size is 5MB"),
        type: z.enum([
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ]),
        file: z.any(),
      }),
      { required_error: "At least one image is required" }
    )
    .nonempty("At least one image is required"),
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(10, "Title must be at least 10 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(30, "Description must be at least 30 characters"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(100, "Price must be at least 100"),
  contactNumber: z
    .string({
      required_error: "Contact is required",
    })
    .regex(/^[0-9]{10}$/, "Invalid phone number"),
  negotiable: z.boolean().optional(),
  userEmail: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export const CreateForm: React.FC = () => {
  // const session: any = useSession<any | null | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: undefined,
      location: undefined,
      youtube: undefined,
      images: [],
      title: undefined,
      description: undefined,
      price: undefined,
      contactNumber: undefined,
      negotiable: false,
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    const currentImages = getValues("images") || [];
    const updatedImages = [...currentImages, ...newImages];

    setValue("images", updatedImages as never);
    trigger("images");

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const onSubmit = async (data: FormData) => {
    setSuccess(false);
    setErrorMessage("");
    setIsLoading(true);
    console.log(data);
    // const submittionResult = await createAd({
    //   ...data,
    //   userEmail: session.data.user.email,
    // });
    // const submittionResult = () => console.log("submit");
    // console.log("submittionResult:", submittionResult);
    // if (submittionResult.error) {
    //   setErrorMessage(submittionResult.message);
    //   return;
    // }
    reset();
    setImagePreviews([]);
    setIsLoading(false);
    setSuccess(true);
  };

  const onError = (errors: unknown) => {
    console.error("Validation errors:", errors);
    setErrorMessage("Incomplete form. Please check again.");
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Post ad</CardTitle>
          <Button
            onClick={() => reset()}
            size={"sm"}
            className="bg-green-500 hover:bg-green-500/90"
          >
            Clear
          </Button>
        </CardHeader>
        <CardContent className="-mt-3">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Tabs defaultValue="Prev">
              <TabsContent value="Prev">
                <div className="grid w-full items-center gap-4">
                  {/* <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={getValues("category")}
                      onValueChange={(value) => {
                        setValue("category", value);
                        trigger("category");
                      }}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {currencies.map((category) => (
                          <SelectItem
                            onClick={(e) => e.stopPropagation()}
                            value={category.value}
                            key={category.label}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-[12px] text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div> */}
                  {/* <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={getValues("location")}
                      onValueChange={(value) => {
                        setValue("location", value);
                        trigger("location");
                      }}
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {locations.map((location) => (
                          <SelectItem
                            onClick={(e) => e.stopPropagation()}
                            value={location.name}
                            key={location.name}
                          >
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.location && (
                      <p className="text-[12px] text-red-500">
                        {errors.location.message}
                      </p>
                    )}
                  </div> */}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="youtube">Link To Youtube Video</Label>
                    <Input
                      {...register("youtube")}
                      id="youtube"
                      placeholder="Please enter the video URL."
                    />
                    {errors.youtube && (
                      <p className="text-[12px] text-red-500">
                        {errors.youtube.message}
                      </p>
                    )}
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="photo">Photo</Label>
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed border-gray-300 p-2 text-center"
                    >
                      <Input
                        {...getInputProps()}
                        id="photo"
                        type="file"
                        className=""
                      />
                      <span className="text-[12px] text-center font-semibold">
                        Drag & drop images here, or click to select files
                      </span>
                      {errors.images?.message &&
                        typeof errors.images.message === "string" && (
                          <p className="text-[12px] text-red-500">
                            {errors.images.message}
                          </p>
                        )}
                      <div className="grid grid-cols-2 xl:grid-cols-5 gap-1 my-2">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative w-[120px] xl:w-[50px] h-[120px] xl:h-[50px] border-2 border-accent-800 rounded-md"
                          >
                            <ResponsiveImage
                              src={preview}
                              alt={`Preview ${index}`}
                            />
                            <CircleX
                              onClick={(event) => {
                                event.stopPropagation();
                                const updatedImages = getValues(
                                  "images"
                                ).filter((_, i) => i !== index);
                                setValue("images", updatedImages as never);
                                setImagePreviews((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                                trigger("images");
                              }}
                              size={20}
                              className="text-red-400 hover:text-red-500 cursor-pointer absolute -top-3 -right-1"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-[12px] text-gray-400 text-center">
                        Supported formats are .jpg, .png, .gif, and .webp;
                        maximum size is 5MB.
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Next">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      {...register("title")}
                      id="title"
                      placeholder="Please enter the title."
                    />
                    {errors.title && (
                      <p className="text-[12px] text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      {...register("description")}
                      id="description"
                      placeholder="Please enter the description."
                    />
                    {errors.description && (
                      <p className="text-[12px] text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      {...register("price", {
                        setValueAs: (value) => Number(value),
                      })}
                      type="number"
                      min={1}
                      id="price"
                      placeholder="Please enter the price."
                    />
                    {errors.price && (
                      <p className="text-[12px] text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      {...register("contactNumber")}
                      type="tel"
                      id="contactNumber"
                      placeholder="Please enter the contact number."
                    />
                    {errors.contactNumber && (
                      <p className="text-[12px] text-red-500">
                        {errors.contactNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      {...register("negotiable")}
                      id="negotiable"
                      className="w-4 h-4 accent-black"
                    />

                    <label
                      htmlFor="negotiable"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Negotiable
                    </label>
                    {errors.negotiable && (
                      <p className="text-[12px] text-red-500">
                        {errors.negotiable.message}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsList className="flex justify-between mt-6">
                <TabsTrigger value="Prev">Prev</TabsTrigger>
                <TabsTrigger value="Next">Next</TabsTrigger>
              </TabsList>
            </Tabs>
            {isLoading ? (
              <div className="bg-gray-200 relative flex justify-start items-center gap-2 mt-3 p-2 rounded-md">
                <CircleAlert size={20} className="text-gray-400" />
                <span className="text-sm">Please waiting...</span>
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                  <Loading size={26} />
                </div>
              </div>
            ) : errorMessage.length > 0 ? (
              <div className="bg-red-200 flex justify-start items-center gap-2 mt-3 p-2 rounded-md">
                <CircleAlert size={20} className="text-red-500" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            ) : (
              success && (
                <div className="bg-green-200 flex justify-start items-center gap-2 mt-3 p-2 rounded-md">
                  <CircleCheckBig size={20} className="text-green-500" />
                  <span className="text-sm">Ad successfully created</span>
                </div>
              )
            )}
            <Button
              // onClick={validate}
              type="submit"
              className="w-full mt-4"
            >
              CREATE AD
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
