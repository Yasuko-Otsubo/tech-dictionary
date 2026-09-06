"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTag } from "../_libs/_actions/tags";

export default function CreateTagButton({ hasTags }: { hasTags: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createTag(name);
      if (result.success) {
        setName("");
        setIsOpen(false);
        router.refresh();
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-block border rounded-4xl py-1 px-2"
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
      <button
        onClick={handleCreate}
        disabled={isPending}
        className="border rounded-sm px-2 py-1 bg-[#7FB9DE] text-[#1F2937] hover:bg-[#6BA6CC]"
      >
        決定
      </button>
      <button
      onClick={() => {
        setIsOpen(false);
        setName("");
      }}
      className="border rounded-sm px-2 py-1 text-gray-500 hover:bg-gray-100">
        キャンセル
      </button>
    </div>
  );
}
