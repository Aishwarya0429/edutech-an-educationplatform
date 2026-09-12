import React, { useEffect, useState } from "react";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";

function RatingStars({ Review_Count = 0, Star_Size }) {
  const [starCount, SetStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0,
  });

  useEffect(() => {
    const count = Review_Count || 0;
    const wholeStars = Math.floor(count);
    SetStarCount({
      full: wholeStars,
      half: Number.isInteger(count) ? 0 : 1,
      empty: Number.isInteger(count) ? 5 - wholeStars : 4 - wholeStars,
    });
  }, [Review_Count]);

  return (
    <div className="flex gap-1 text-yellow-100">
      {[...new Array(Math.max(0, starCount.full))].map((_, i) => (
        <TiStarFullOutline key={i} size={Star_Size || 20} />
      ))}
      {[...new Array(Math.max(0, starCount.half))].map((_, i) => (
        <TiStarHalfOutline key={i} size={Star_Size || 20} />
      ))}
      {[...new Array(Math.max(0, starCount.empty))].map((_, i) => (
        <TiStarOutline key={i} size={Star_Size || 20} />
      ))}
    </div>
  );
}

export default RatingStars;
