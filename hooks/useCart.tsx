import { CartProductType } from "@/types/product";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

// Define type
type CartcontextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  orderProducts: CartProductType[] | null; //test order
  handleAddProductToCart: (product: CartProductType) => void;
  handleAddProductToOrder: (product: CartProductType) => void; //test order
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
};

// Create a context and export it
export const CartContext = createContext<CartcontextType | null>(null);

interface Props {
  [propName: string]: any;
}

// Create a context provider and export it
export const CartContextProvider = (props: Props) => {
  // Create anything you want to share with another component.

  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );
  //test order
  const [orderProducts, setOrderProducts] = useState<CartProductType[] | null>(
    null
  );

  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  // console.log("qty", cartTotalQty);
  // console.log("amout", cartTotalAmount);

  // Get cart items from localStorage
  useEffect(() => {
    const cartItems: any = localStorage.getItem("ShopCartItems");
    const cProduct: CartProductType[] | null = JSON.parse(cartItems);

    // test order
    const orderItems: any = localStorage.getItem("ShopOrderItems");
    const oProduct: CartProductType[] | null = JSON.parse(orderItems);

    // Get payment intent from localStorage
    const eShopPaymentIntent: any = localStorage.getItem("eShopPaymentIntent");
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);

    setCartProducts(cProduct);
    setOrderProducts(oProduct); // test order
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotal = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;
            return acc;
          },
          { total: 0, qty: 0 }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };
    getTotal();
  });

  // Function for adding a product to the cart
  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;
      if (prev) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }
      toast.success("เพิ่มสินค้าในตะกร้าแล้ว");

      localStorage.setItem("ShopCartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);
  // Function for adding a product to the cart
  const handleAddProductToOrder = useCallback((product: CartProductType) => {
    setOrderProducts((prev) => {
      let updatedOrder;
      if (prev) {
        updatedOrder = [...prev, product];
      } else {
        updatedOrder = [product];
      }
      toast.success("เพิ่มคำสั่งซื้อสำเร็จ");

      localStorage.setItem("ShopOrderItems", JSON.stringify(updatedOrder));
      return updatedOrder;
    });
  }, []);

  // Function for removing a product from the cart
  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter((item) => {
          return item.id !== product.id;
        });
        console.log(filteredProducts);

        setCartProducts(filteredProducts);
        toast.success("ลบสินค้าแล้ว");
        localStorage.setItem("ShopCartItems", JSON.stringify(filteredProducts));
      }
    },
    [cartProducts]
  );

  // Function for increasing a product to the cart
  const handleCartQtyIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 99) {
        return toast.error("เกินขีดจำกัดจำนวนสูงสุดที่เพิ่มได้แล้ว");
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];

        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity =
            updatedCart[existingIndex].quantity + 1;
        }

        setCartProducts(updatedCart);
        localStorage.setItem("ShopCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  // Function for decreasing a product to the cart
  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 1) {
        return toast.error("ขั้นต่ำ 1 ชิ้น");
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];

        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity =
            updatedCart[existingIndex].quantity - 1;
        }

        setCartProducts(updatedCart);
        localStorage.setItem("ShopCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  // Clear cart
  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.setItem("ShopCartItems", JSON.stringify(null));
  }, []);

  // Payment
  const handleSetPaymentIntent = useCallback(
    (val: string | null) => {
      setPaymentIntent(val);
      localStorage.setItem("eShopPaymentIntent", JSON.stringify(val));
    },
    [paymentIntent]
  );

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    orderProducts, // test order
    handleAddProductToCart,
    handleAddProductToOrder, // test order
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
  };

  // Return the value within the context for sharing with each component
  return <CartContext.Provider value={value} {...props} />;
};

// Export the cart context
export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used within a CartContextProvider");
  }

  return context;
};
