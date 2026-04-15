"use client";

import { Node } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { type ChangeEvent, type ReactNode, useRef, useState } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type ModalCardProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

function ModalCard({ title, onClose, children }: ModalCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl dark:bg-zinc-900">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
          >
            Kapat
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const Figure = Node.create({
  name: "figure",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: "",
      },
      caption: {
        default: "",
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "figure[data-type='image-figure']",
        getAttrs: (element) => {
          const dom = element as HTMLElement;
          const image = dom.querySelector("img");
          const caption = dom.querySelector("figcaption");
          return {
            src: image?.getAttribute("src") ?? "",
            alt: image?.getAttribute("alt") ?? "",
            caption: caption?.textContent ?? "",
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => {
          const dom = element as HTMLElement;
          return {
            src: dom.getAttribute("src") ?? "",
            alt: dom.getAttribute("alt") ?? "",
            caption: "",
          };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const src = String(HTMLAttributes.src ?? "");
    const alt = String(HTMLAttributes.alt ?? "");
    const caption = String(HTMLAttributes.caption ?? "");

    return [
      "figure",
      {
        "data-type": "image-figure",
      },
      ["img", { src, alt, loading: "lazy" }],
      ["figcaption", {}, caption],
    ];
  },
});

function ToolbarButton(props: {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
        props.isActive
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
      }`}
    >
      {props.label}
    </button>
  );
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Figure,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] rounded-b-lg border border-t-0 border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 [&_a]:font-semibold [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:bg-blue-50/70 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:italic dark:[&_blockquote]:border-blue-900 dark:[&_blockquote]:bg-blue-950/40 [&_figure]:my-5 [&_figure_img]:w-full [&_figure_img]:rounded-xl [&_figure_img]:border [&_figure_img]:border-zinc-200 dark:[&_figure_img]:border-zinc-700 [&_figure_figcaption]:mt-2 [&_figure_figcaption]:text-center [&_figure_figcaption]:text-xs [&_figure_figcaption]:text-zinc-500 dark:[&_figure_figcaption]:text-zinc-400 [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
      },
    },
    onUpdate({ editor: nextEditor }) {
      onChange(nextEditor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const openLinkModal = () => {
    const currentUrl = editor.getAttributes("link").href as string | undefined;
    setLinkUrl(currentUrl ?? "");
    setIsLinkModalOpen(true);
  };

  const applyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
      setIsLinkModalOpen(false);
      return;
    }
    editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    setIsLinkModalOpen(false);
  };

  const insertImageFigure = () => {
    if (!imageUrl.trim()) {
      setUploadError("Resim URL alanı boş olamaz.");
      return;
    }
    editor
      .chain()
      .focus()
      .insertContent({
        type: "figure",
        attrs: {
          src: imageUrl.trim(),
          alt: imageAlt.trim(),
          caption: imageCaption.trim(),
        },
      })
      .run();

    setUploadError("");
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
    setIsImageModalOpen(false);
  };

  const onUploadImageFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads/image", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { error?: string; data?: { url: string } };
      if (!response.ok || !payload.data?.url) {
        setUploadError(payload.error ?? "Yukleme basarisiz oldu.");
        return;
      }

      setImageUrl(payload.data.url);
    } catch {
      setUploadError("Yukleme sirasinda beklenmeyen bir hata olustu.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-t-lg border border-zinc-300 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900/70">
        <ToolbarButton
          label="Kalın"
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="İtalik"
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Alt Başlık"
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="Madde Listesi"
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numaralı Liste"
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Alıntı"
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton label="Link" isActive={editor.isActive("link")} onClick={openLinkModal} />
        <ToolbarButton
          label="Resim"
          onClick={() => {
            setUploadError("");
            setIsImageModalOpen(true);
          }}
        />
      </div>
      <EditorContent editor={editor} />

      {isLinkModalOpen ? (
        <ModalCard title="Link Ekle / Duzenle" onClose={() => setIsLinkModalOpen(false)}>
          <div className="space-y-3">
            <input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://ornek.com"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setIsLinkModalOpen(false);
                }}
                className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
              >
                Linki Kaldir
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="rounded-md bg-blue-700 px-3 py-1 text-sm font-semibold text-white"
              >
                Kaydet
              </button>
            </div>
          </div>
        </ModalCard>
      ) : null}

      {isImageModalOpen ? (
        <ModalCard title="Resim Ekle" onClose={() => setIsImageModalOpen(false)}>
          <div className="space-y-3">
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Resim URL (https://...)"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <input
              value={imageAlt}
              onChange={(event) => setImageAlt(event.target.value)}
              placeholder="Alt metin (opsiyonel)"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <input
              value={imageCaption}
              onChange={(event) => setImageCaption(event.target.value)}
              placeholder="Resim alt yazisi (opsiyonel)"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onUploadImageFile} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-semibold text-zinc-700 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200"
              >
                {isUploading ? "Yukleniyor..." : "Dosya Yukle"}
              </button>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Maksimum 8MB</span>
            </div>
            {uploadError ? <p className="text-xs text-red-600 dark:text-red-400">{uploadError}</p> : null}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={insertImageFigure}
                className="rounded-md bg-blue-700 px-3 py-1 text-sm font-semibold text-white"
              >
                Resmi Ekle
              </button>
            </div>
          </div>
        </ModalCard>
      ) : null}
    </div>
  );
}
