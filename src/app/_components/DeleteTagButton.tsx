"use client"

import { deleteTag } from "@/app/_libs/_actions/tags";
import { useRouter } from "next/navigation";
import { useTransition } from "react"
import { BUTTON_PRIMARY } from "../_libs/buttonStyles";

export default function DeleteTagButton({ id } : { id: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("このタグを削除しますか？")) return;
    startTransition(async () => {
      await deleteTag(id);
      router.refresh();
    });
  };

  return (
    <button
    type="button"
    onClick={handleDelete}
    disabled={isPending}
    className={`${BUTTON_PRIMARY} whitespace-nowrap hover:text-red-600`}>
      タグを削除
    </button>
  )
}