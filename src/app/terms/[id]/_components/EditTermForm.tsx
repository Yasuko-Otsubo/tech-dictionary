"use client";

import CreateTagButton from "@/app/_components/CreateTagButton";
import { TermFormValues, termSchema } from "@/app/_libs/_actions/schemas/terms";
import { updateTerm } from "@/app/_libs/_actions/terms";
import {
  BUTTON_BASE,
  BUTTON_DANGER,
  BUTTON_PRIMARY,
  LABEL_TEXT,
} from "@/app/_libs/buttonStyles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function EditTermForm({
  id,
  defaultValues,
  tags,
}: {
  id: number;
  defaultValues: TermFormValues;
  tags: { id: number; name: string; userId: number; color: string }[];
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TermFormValues>({
    resolver: zodResolver(termSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "referenceUrls",
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (data: TermFormValues) => {
    startTransition(async () => {
      const result = await updateTerm(id, data);
      if (result.success) {
        router.push("/");
      }
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-2">
      <div className="mb-4">
        <p className={LABEL_TEXT}>用語名</p>
        <input
          className={`${BUTTON_BASE} w-full`}
          id="itemName"
          {...register("itemName")}
        />
        {errors.itemName && (
          <p className="text-red-500 text-sm mt-1">{errors.itemName.message}</p>
        )}
      </div>

      <div className="mb-4">
        <p className={LABEL_TEXT}>説明</p>
        <input
          className={`${BUTTON_BASE} w-full`}
          id="itemContent"
          {...register("itemContent")}
        />
        {errors.itemContent && (
          <p className="text-red-500 text-sm mt-1">
            {errors.itemContent.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <p className={LABEL_TEXT}>画像</p>
        <input
          className={`${BUTTON_BASE} w-full`}
          id="image"
          {...register("image")}
        />
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
        )}
      </div>

      <div className="mb-4">
        <p className={LABEL_TEXT}>参考URL</p>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              className={`${BUTTON_BASE} flex-1`}
              {...register(`referenceUrls.${index}.value`)}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className={BUTTON_DANGER}
            >
              削除
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ value: "" })}
          className={BUTTON_BASE}
        >
          URLを追加
        </button>
      </div>
      <div className="mb-4">
        <p className={LABEL_TEXT}>タグ</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <label
              key={tag.id}
              style={{ backgroundColor: tag.color }}
              className={`inline-flex items-center gap-1 ${BUTTON_BASE} text-[#1F2937]`}
            >
              <input type="checkbox" value={tag.name} {...register("tags")} />
              {tag.name}
            </label>
          ))}
        </div>
        <CreateTagButton hasTags={tags.length > 0} />
      </div>
      <button className={`${BUTTON_PRIMARY} `} type="submit">
        編集を保存する
      </button>
    </form>
  );
}
