"use client";

import { deleteTerm } from "@/app/_libs/_actions/terms";
import { BUTTON_DANGER } from "@/app/_libs/buttonStyles";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function DeleteTermButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("この用語を削除しますか？")) return;
    startTransition(async () => {
      await deleteTerm(id);
      router.push("/");
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={BUTTON_DANGER}
    >
      削除
    </button>
  );
}
