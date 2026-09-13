"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({
  images,
  itemName,
}: {
  images: string[];
  itemName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {images.map((url, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="relative w-40 h-40 cursor-pointer"
          >
            <Image
              src={url}
              alt={`${itemName}の画像${index + 1}`}
              fill
              className="object-cover rounded-sm"
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div className="relative w-full max-w-3xl h-[80vh]">
            <Image
              src={images[selectedIndex]}
              alt={`${itemName}の画像${selectedIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
