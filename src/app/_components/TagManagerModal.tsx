"use client";

import { useState } from "react";
import DeleteTagButton from "./DeleteTagButton";

type Tag = {
  id: number;
  name: string;
  color: string;
};

export default function TagManagerModal({
  hasTag,
  tags,
}: {
  hasTag: boolean;
  tags: Tag[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const selectedTag = tags.find((tag) => tag.id === selectedTagId);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} type="button">
        {hasTag ? "＋" : "タグ追加"}
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-sm p-4 max-w-md w-full"
      >
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => setSelectedTagId(tag.id)}
            style={{ backgroundColor: tag.color }}
            className="inline-block border rounded-sm px-2 py-1 mr-2 mb-2 text-[#1F2937]"
          >
            {tag.name}
          </button>
        ))}
        {selectedTag && (
          <div className="mt-4 border-t pt-4">
            <p>{selectedTag.name}を編集</p>
            <DeleteTagButton id={selectedTag.id} />
          </div>
        )}
      </div>
    </div>
  );
}
