import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { ProductType } from "@/types/fetchTypes";
import React, { useState } from "react";

type ProductCardProps = {
  product: ProductType;
};

const PromotionProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Filter ข้อมูลสินค้าตามสีและขนาดที่เลือก
  const filteredVariants = product.productVariants?.filter(
    (variant) =>
      (!selectedColor || variant.color === selectedColor) &&
      (!selectedSize || variant.size === selectedSize)
  );

  const selectedVariant = filteredVariants ? filteredVariants[0] : null;

  // หาสีและขนาดที่มีอยู่
  const availableColors = Array.from(
    new Set(product.productVariants?.map((variant) => variant.color))
  );

  const allAvailableSizes = Array.from(
    new Set(product.productVariants?.map((variant) => variant.size))
  );

  const availableSizes = Array.from(
    new Set(
      product.productVariants
        ?.filter((variant) => variant.color === selectedColor)
        .map((variant) => variant.size)
    )
  );

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.stock > 0) {
      console.log(selectedVariant);
      alert(
        `Added ${product.name} (${selectedVariant.color} - ${selectedVariant.size}) to cart`
      );
    } else {
      alert("Sorry, this product is out of stock.");
    }
  };

  return (
    <div className="border rounded-lg p-4 max-w-md shadow-md">
      <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-500 mb-4">{product.description}</p>

      {selectedVariant && (
        <ResponsiveImage
          src={selectedVariant.image}
          alt={`${product.name} ${selectedColor}`}
        />
      )}

      {/* Color Picker */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Color:</label>
        <div className="flex gap-2">
          {availableColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`py-2 px-4 rounded ${
                selectedColor === color
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Picker */}
      {selectedColor ? (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Select Size:</label>
          <div className="flex gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-4 rounded ${
                  selectedSize === size
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Select Size:</label>
          <div className="flex gap-2">
            {allAvailableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-4 rounded ${
                  selectedSize === size
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display Price and Stock */}
      {selectedVariant && (
        <>
          <p className="text-xl font-bold mb-2">${selectedVariant.price}</p>
          <p className="text-sm text-gray-500">
            Stock:{" "}
            {selectedVariant.stock > 0 ? selectedVariant.stock : "Out of Stock"}
          </p>
        </>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedVariant || selectedVariant.stock <= 0}
        className={`mt-4 w-full py-2 rounded ${
          selectedVariant && selectedVariant.stock > 0
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default PromotionProductCard;
