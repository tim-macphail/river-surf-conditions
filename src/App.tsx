import React, { useState } from "react";
import StarRatingInput from "./StarRatingInput";

const App: React.FC = () => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div className="container flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Star Rating Input Example</h1>
      <StarRatingInput rating={rating} onChange={handleRatingChange} />
      <p className="mt-4">Selected Rating: {rating} stars</p>
    </div>
  );
};

export default App;
