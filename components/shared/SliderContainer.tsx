"use client";

import { Splide, SplideSlide, SplideProps } from "@splidejs/react-splide";
import "@splidejs/react-splide/css"; // base CSS

type Props = {
  children: React.ReactNode[];
  options?: SplideProps["options"];
  showDots?: boolean;
  breakpoints?: {
    [key: number]: { perPage: number; arrows?: boolean; gap?: string };
  };
};

const defaultBreakpoints = {
  1280: { perPage: 3 },
  768: { perPage: 2, arrows: false },
  480: { perPage: 1, arrows: false },
};

/*  ถ้าต้องการให้ทุกขนาดหน้าจอมีการแสดงผลเหมือนกัน คือ แค่ 1 item และไม่แสดงปุ่ม prev/next (max-with = 9999) เช่น banner
<SliderContainer
breakpoints={{
  9999: { perPage: 1, arrows: false }, 
}}
></SliderContainer>
*/

export default function SliderContainer({
  children,
  options,
  showDots = true,
  breakpoints = defaultBreakpoints,
}: Props) {
  return (
    <div className="relative">
      <Splide
        options={{
          type: "slide",
          perPage: 4,
          gap: "1rem",
          pagination: showDots,
          arrows: true,
          breakpoints,
          ...options,
        }}
        aria-label="Slider Container"
        className="relative"
      >
        {children.map((child, index) => (
          <SplideSlide key={index}>{child}</SplideSlide>
        ))}
      </Splide>

      {/* ✅ Custom dot style */}
      <style jsx global>{`
        .splide__pagination {
          position: absolute;
          bottom: -1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }

        .splide__pagination__page {
          width: 6px;
          height: 6px;
          margin: 0px;
          background-color: rgb(201, 200, 199);
          opacity: 1;
          transition: 0.4s;
        }

        .splide__pagination__page.is-active {
          cursor: default;
          width: 28px;
          height: 6px;
          border-radius: 3px;
          opacity: 1;
          background-color: rgb(34, 34, 34);
          transform: unset;
        }

        .splide__arrow {
          width: 40px;
          height: 40px;
          background-color: rgb(255, 255, 255);
          box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 7.5px 2px;
        }

        .splide__arrow:disabled {
          opacity: 0;
        }

        .splide__arrow.splide__arrow--prev {
          left: -16px;
        }

        .splide__arrow.splide__arrow--next {
          right: -16px;
        }

        .splide__arrow:hover {
          background-color: #f3f4f6; /* gray-100 */
        }

        @media (max-width: 768px) {
          .splide__arrow {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
