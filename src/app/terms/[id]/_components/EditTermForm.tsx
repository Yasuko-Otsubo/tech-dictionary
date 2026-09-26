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
import { supabase } from "@/app/_libs/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
    formState: { errors, isDirty },
  } = useForm<TermFormValues>({
    resolver: zodResolver(termSchema),
    defaultValues,
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
  const [noChangeError, setNoChangeError] = useState(false);

  const onSubmit = async (data: TermFormValues) => {
    if (!isDirty && selectedFiles.length === 0) {
      setNoChangeError(true);
      return;
    }

    let imageUrls: string[] = defaultValues.images ?? [];
    let hasError = false;

    if (selectedFiles.length > 0) {
      imageUrls = [];
      setUploadErrors([]);
    }

    for (const file of selectedFiles) {
      const extension = file.name.split(".").pop();
      const filePath = `${file.lastModified}.${extension}`;
      const { error } = await supabase.storage
        .from("term-images")
        .upload(filePath, file, { upsert: true });

      if (error) {
        hasError = true;
        setUploadErrors((prev) => [...prev, `${file.name}は保存できません`]);
        console.error("アップロード失敗:", error);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("term-images")
          .getPublicUrl(filePath);
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    if (hasError) {
      return;
    }

    startTransition(async () => {
      const result = await updateTerm(id, { ...data, images: imageUrls });
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
          <p className="text-red-500 text-sm mt-1">{errors.itemName.message}</p>
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

      {noChangeError && (
        <p className="text-red-500 text-sm mb-2">変更されていません</p>
      )}
      {submitError && (
        <p className="text-red-500 text-sm mb-2">{submitError}</p>
      )}
      <div className="flex gap-2">
        <button className={`${BUTTON_PRIMARY} `} type="submit">
          編集を保存する
        </button>
        <Link href="/" className={BUTTON_BASE}>
          編集をキャンセルする
        </Link>
      </div>
    </form>
  );
}
