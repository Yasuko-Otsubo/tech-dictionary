"use client";

import { deleteTerm } from "@/app/_libs/_actions/terms";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function DeleteTermButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTerm(id);
      router.push("/");
    });
  };

  return (
    <button onClick={handleDelete} disabled={isPending}>
      削除
    </button>
  );
}
