"use client";

import { TermFormValues, termSchema } from "@/app/_libs/_actions/schemas/terms";
import { createTerm } from "@/app/_libs/_actions/terms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

export default function NewTermForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TermFormValues>({
    resolver: zodResolver(termSchema),
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (data: TermFormValues) => {
    startTransition(async () => {
      const result = await createTerm(data);
      if(result.success) {
        router.push("/");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>用語名</label>
      <input className="border-[1]" id="itemName" {...register("itemName")} />
      {errors.itemName && <p>{errors.itemName.message}</p>}
      <label>説明</label>
      <input className="border-[1]" id="itemContent" {...register("itemContent")} />
      {errors.itemContent && <p>{errors.itemContent.message}</p>}
      <label>url</label>
      <input className="border-[1]" id="referenceUrl" {...register("referenceUrl")} />
      {errors.referenceUrl && <p>{errors.referenceUrl.message}</p>}
      <label>画像</label>
      <input className="border-[1]" id="image" {...register("image")} />
      {errors.image && <p>{errors.image.message}</p>}
      <button className="border-[1]" type="submit">登録</button>
    </form>
  );
}
