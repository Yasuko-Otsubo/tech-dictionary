"use client";

import CreateTagButton from "@/app/_components/CreateTagButton";
import { TermFormValues, termSchema } from "@/app/_libs/_actions/schemas/terms";
import { createTerm } from "@/app/_libs/_actions/terms";
import {
  BUTTON_BASE,
  BUTTON_DANGER,
  BUTTON_PRIMARY,
  LABEL_TEXT,
} from "@/app/_libs/buttonStyles";
import { supabase } from "@/app/_libs/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function NewTermForm({
  tags,
}: {
  tags: { id: number; name: string; userId: number; color: string }[];
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TermFormValues>({
    resolver: zodResolver(termSchema),
    defaultValues: { tags: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "referenceUrls",
  });

  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

  const onSubmit = async (data: TermFormValues) => {
    const imageUrls: string[] = [];
    setUploadErrors([]);

    for (const file of selectedFiles) {
      const filePath = `${file.lastModified}-${file.name}`;
      const { error } = await supabase.storage
        .from("term-images")
        .upload(filePath, file);

      if (error) {
        setUploadErrors((prev) => [
          ...prev,
          `${file.name}のアップロードに失敗しました`,
        ]);
        console.error("アップロード失敗:", error);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("term-images")
          .getPublicUrl(filePath);
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    startTransition(async () => {
      const result = await createTerm({ ...data, images: imageUrls });
      if (result.success) {
        router.push("/");
      } else {
        console.error("用語登録失敗", result.error);
        setSubmitError(result.error);
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
          <p className="text-red-500 text-sm ml-1">{errors.itemName.message}</p>
        )}
      </div>

      <div className="mb-4">
        <p className={LABEL_TEXT}>画像</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
          className={`${BUTTON_BASE} w-full`}
          id="image"
        />
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

      {uploadErrors.map((message, index) => (
        <p key={index} className="text-red-500 text-sm mt-1">
          {message}
        </p>
      ))}
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

      {submitError && (
        <p className="text-red-500 text-sm mb-2">{submitError}</p>
      )}
      <button type="submit" disabled={isPending} className={BUTTON_PRIMARY}>
        {isPending ? "登録中..." : "登録"}
      </button>
    </form>
  );
}
