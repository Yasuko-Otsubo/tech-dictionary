"use client";

import { useState } from "react";

export default function TagManagerModal({ hasTag }: { hasTag: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} type="button">
        {hasTag ? "＋" : "タグ追加"}
      </button>
    );
  }

  return <div></div>;
}
