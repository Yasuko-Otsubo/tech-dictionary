"use client";

import { useState, useTransition } from "react";
import DeleteTagButton from "./DeleteTagButton";
import { TAG_COLORS } from "../_libs/tagColors";
import { updateTag } from "../_libs/_actions/tags";
import { useRouter } from "next/navigation";
import { BUTTON_PRIMARY } from "../_libs/buttonStyles";
import CreateTagButton from "./CreateTagButton";

type Tag = {
  id: number;
  name: string;
  color: string;
};

export default function TagManagerModal({
  hasTag,
  tags,
}: {
  hasTag: boolean;
  tags: Tag[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const resetAndClose = () => {
    setIsOpen(false);
    setSelectedTagId(null);
    setEditName("");
    setEditColor("");
    setError(null);
  };
  const selectedTag = tags.find((tag) => tag.id === selectedTagId);
  const handleUpdate = () => {
    if (!selectedTag) return;
    startTransition(async () => {
      const result = await updateTag(selectedTag.id, editName, editColor);
      if (result.success) {
        resetAndClose();
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  const isDirty = selectedTag
    ? editName !== selectedTag.name || editColor !== selectedTag.color
    : false;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`${BUTTON_PRIMARY} whitespace-nowrap`}
      >
        {hasTag ? "タグ管理" : "タグ追加"}
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={resetAndClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-sm p-4 max-w-md w-full"
      >
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => {
              setSelectedTagId(tag.id);
              setEditName(tag.name);
              setEditColor(tag.color);
            }}
            style={{ backgroundColor: tag.color }}
            className="inline-block border rounded-sm px-2 py-1 mr-2 mb-2 text-[#1F2937]"
          >
            {tag.name}
          </button>
        ))}
        <CreateTagButton hasTags={tags.length > 0} />

        {selectedTag && (
          <div className="mt-4 border-t pt-4">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="タグ名"
              className="border rounded-sm px-2 py-1 mb-2"
            />
            <div className="flex gap-2">
              {TAG_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setEditColor(c.value)}
                  className={`w-8 h-8 rounded-full border ${editColor === c.value ? "border-gray-800" : "border-gray-300"}`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={handleUpdate}
                disabled={isPending}
                type="button"
                className={`${BUTTON_PRIMARY} w-full`}
              >
                決定
              </button>
              <div className="flex justify-between items-center">
                {isDirty ? (
                  <p className="text-sm text-gray-400">
                    編集中は削除できません
                  </p>
                ) : (
                  <DeleteTagButton id={selectedTag.id} />
                )}
                <button
                  onClick={resetAndClose}
                  type="button"
                  className="border rounded-sm px-2 py-1 text-gray-500 hover:bg-gray-100"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
