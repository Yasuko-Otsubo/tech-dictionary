"use client";

import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          太字
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          下線
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
