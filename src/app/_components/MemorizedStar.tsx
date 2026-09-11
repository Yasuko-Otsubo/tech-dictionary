"use client";

import { useState, useTransition } from "react";
import { setMemorizedLevel } from "../_libs/_actions/terms";

const MAX_LEVEL = 3;

export default function MemorizedStars({
  id,
  level,
}: {
  id: number;
  level: number;
}) {
  const [displayLevel, setDisplayLevel] = useState(level);
  const [, starTrantition] = useTransition();

  const handleClick = (star: number) => {
    setDisplayLevel(star);
    starTrantition(() => {
      setMemorizedLevel(id, star);
    });
  };

  return (
    <span className="inline-flex">
      {[1, 2, 3].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          className="text-xl leading-none cursor-pointer"
        >
          {star <= displayLevel ? "★" : "☆"}
        </button>
      ))}
    </span>
  );
}
