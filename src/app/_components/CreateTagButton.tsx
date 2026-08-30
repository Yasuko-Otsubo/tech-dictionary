"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTag } from "../_libs/_actions/tags";

export default function CreateTagButton({ hasTags }: { hasTags: boolean}) {
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
    <button onClick={() => setIsOpen(true)}>
      {hasTags ? "+": "タグ追加"}
      </button>
    );
  }

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="タグ名"
      />
      <button onClick={handleCreate} disabled={isPending}>
        決定
      </button>
    </div>
  );
}
