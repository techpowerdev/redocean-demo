"use client";
import { FaArrowUp } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={`fixed right-6 bottom-6 p-3 rounded-sm bg-primary hover:bg-primary-focus ${
        showBackToTop ? "block" : "hidden"
      }`}
      onClick={backToTop}
    >
      <div className="text-site-bgBase text-sm">
        <FaArrowUp />
      </div>
    </button>
  );
}
