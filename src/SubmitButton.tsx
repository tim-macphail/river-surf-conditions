import React, { useState } from "react";

interface SubmitButtonProps {
  loading: boolean;
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick();
  };

  return (
    <button
      className={`py-2 px-4 rounded ${
        loading || isClicked
          ? "opacity-50 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
      onClick={handleClick}
      disabled={loading || isClicked}
    >
      {loading ? "Loading..." : "Submit"}
    </button>
  );
};

export default SubmitButton;
