"use client"

import { deleteTag } from "@/app/_libs/_actions/tags";
import { useRouter } from "next/navigation";
import { useTransition } from "react"

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
    className="ml-1 px-1.5 py-1 text-[#1F2937] hover:text-red-600">
      ✖
    </button>
  )
}