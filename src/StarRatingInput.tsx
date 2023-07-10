import React, { useState } from "react";

interface StarRatingInputProps {
  rating: number;
  onChange: (rating: number) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  onChange,
}) => {
  const handleClick = (newRating: number) => {
    onChange(newRating);
  };

  const starIcons = [1, 2, 3, 4, 5];

  return (
    <div>
      {starIcons.map((value) => (
        <span
          key={value}
          className={`cursor-pointer text-5xl text-yellow-500`}
          onClick={() => handleClick(value)}
        >
          {value <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default StarRatingInput;
