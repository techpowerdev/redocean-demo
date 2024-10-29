// "use client";
// import { useState } from "react";

// interface StarRatingProps {
//   initialRating: number;
// }

// export default function StarRating({ initialRating }: StarRatingProps) {
//   const [selectedRating, setSelectedRating] = useState(initialRating);

//   const handleRatingChange = (newRating: number) => {
//     setSelectedRating(newRating);
//   };

//   return (
//     <div className="rating">
//       {[1, 2, 3, 4, 5].map((value) => (
//         <input
//           key={value}
//           type="radio"
//           name="rating-1"
//           className="mask mask-star"
//           checked={selectedRating === value}
//           onChange={() => handleRatingChange(value)}
//         />
//       ))}
//     </div>
//   );
// }
"use client";
import { useState } from "react";

interface StarRatingProps {
  initialRating: number;
}

// const StarRating: React.FC<StarRatingProps> = ({ initialRating }) => {
const StarRating = () => {
  // const [rating, setRating] = useState(2);

  // const handleRatingChange = (newRating: number) => {
  //   setRating(newRating);
  // };

  return (
    // <div className="rating">
    //   {[1, 2, 3, 4, 5].map((value) => (
    //     <input
    //       key={value}
    //       type="radio"
    //       name="rating-1"
    //       className="mask mask-star"
    //       checked={rating === value}
    //       onChange={() => handleRatingChange(value)}
    //     />
    //   ))}
    // </div>
    <div className="rating">
      <input type="radio" name="rating-1" className="mask mask-star" />
      <input type="radio" name="rating-1" className="mask mask-star" checked />
      <input type="radio" name="rating-1" className="mask mask-star" />
      <input type="radio" name="rating-1" className="mask mask-star" />
      <input type="radio" name="rating-1" className="mask mask-star" />
    </div>
  );
};

export default StarRating;
