"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTag } from "../_libs/_actions/tags";
import { TAG_COLORS } from "../_libs/tagColors";
import { BUTTON_PRIMARY } from "../_libs/buttonStyles";

export default function CreateTagButton({ hasTags }: { hasTags: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(TAG_COLORS[0].value);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createTag(name, color);
      if (result.success) {
        setName("");
        setError(null);
        setIsOpen(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="inline-block border rounded-4xl py-1 px-2 cursor-pointer"
      >
        {hasTags ? "＋" : "タグ追加"}
      </button>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="タグ名"
        className="border rounded-sm px-2 py-1"
      />
      <div className="flex gap-2">
        {TAG_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setColor(c.value)}
            className={`w-8 h-8 rounded-full border ${color === c.value ? "border-gray-800" : "border-gray-300"}`}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleCreate}
        disabled={isPending}
        type="button"
        className={BUTTON_PRIMARY}
      >
        決定
      </button>
      <button
        onClick={() => {
          setIsOpen(false);
          setName("");
        }}
        type="button"
        className="border rounded-sm px-2 py-1 text-gray-500 hover:bg-gray-100"
      >
        キャンセル
      </button>
    </div>
  );
}
