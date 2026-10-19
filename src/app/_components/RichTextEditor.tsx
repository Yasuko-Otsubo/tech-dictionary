"use client";

import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BUTTON_BASE } from "../_libs/buttonStyles";
import { FaHighlighter } from "react-icons/fa";
import { useState } from "react";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { TEXT_COLORS } from "../_libs/textColors";
import { HexColorPicker } from "react-colorful";

const Tiptap = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [textColor, setTextColor] = useState("#000");
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight, TextStyle, Color],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `${BUTTON_BASE} min-h-[150px]`,
      },
    },
  });

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          title="太字"
          className={`${BUTTON_BASE} font-bold ${editor?.isActive("bold") ? "bg-[#E4F1F8]" : ""}`}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          title="下線"
          className={`${BUTTON_BASE} underline ${editor?.isActive("underline") ? "bg-[#E4F1F8]" : ""}`}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          U
        </button>
        <button
          type="button"
          title="ハイライト"
          className={`${BUTTON_BASE} highlight ${editor?.isActive("highlight") ? "bg-[#E4F1F8]" : ""}`}
          onClick={() => editor?.chain().focus().toggleHighlight().run()}
        >
          <FaHighlighter />
        </button>
        <div className="relative">
          <button
            type="button"
            title="文字色"
            onClick={() => {
              const next = !isColorPickerOpen;
              setIsColorPickerOpen(next);
            }}
            className={`${BUTTON_BASE} ${isColorPickerOpen ? "bg-[#E4F1F8]" : ""}`}
          >
            A
          </button>{" "}
          {isColorPickerOpen && (
            <div className="absolute z-10 flex flex-col gap-1 bg-white border border-gray-300 p-2  shadow-md ml-16">
              <div className="flex gap-1">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.name}
                    onClick={() =>
                      editor?.chain().focus().setColor(c.value).run()
                    }
                    className="w-6 h-6 border border-gray-300 rounded p-2 shadow-md"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
              <HexColorPicker
                color={textColor}
                onChange={(color) => {
                  setTextColor(color);
                  editor?.chain().focus().setColor(color).run();
                }}
              />
            </div>
          )}
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
