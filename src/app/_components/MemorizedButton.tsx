"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleMemorized } from "../_libs/_actions/terms";

export default function MemorizedButton({
  id,
  isMemorized,
}: {
  id: number;
  isMemorized: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleMemorized(id, isMemorized);
      router.refresh();
    });
  };

  return (
    <button
    type="button"
    onClick={handleToggle}
    disabled={isPending}
    className="text-xl leading-none cursor-pointer"
    >
      {isMemorized ? "★" : "☆"}
    </button>
  );
}