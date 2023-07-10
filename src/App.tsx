import React, { useState, useEffect } from "react";
import StarRatingInput from "./StarRatingInput";
import SubmitButton from "./SubmitButton";

const dataUrl =
  "https://rivers.alberta.ca/apps/Basins/data/figures/river/abrivers/stationdata/R_HG_05BH004_table.json";

const App: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [conditions, setConditions] = useState<entry | null>(null);

  interface entry {
    datetime: string;
    level: number;
    flow: number;
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(dataUrl);
      const jsonResponse = await response.json();
      const entries = jsonResponse[0].data;
      const recentEntry = entries[entries.length - 1];
      const [datetime, level, flow] = recentEntry;
      console.table({ datetime, level, flow });
      setConditions({ datetime, level, flow });
    };
    fetchData();
  }, []);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      setTimeout(() => setSubmitting(false), 3000);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-items-center p-4">
      <h1 className="text-4xl font-bold mb-4">Current Conditions</h1>
      {conditions ? (
        <div className="flex flex-col items-center">
          <p>level: {conditions.level.toFixed(2)} m</p>
          <p>flow: {conditions.flow.toFixed(2)} m3/s</p>
          <p>last updated: {conditions.datetime}</p>
        </div>
      ) : (
        <p className="text-2xl font-bold mb-4">Loading...</p>
      )}

      <h1 className="text-4xl font-bold my-4">Rate the Current Conditions</h1>
      <StarRatingInput rating={rating} onChange={handleRatingChange} />
      <SubmitButton loading={submitting} onClick={handleSubmit} />
    </div>
  );
};

export default App;
