"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { EditorThemeClasses } from "lexical";

import { MediaNode } from "./nodes/media-node";
import DragDropPastePlugin from "./plugins/drag-drop-paste-plugin";
import { MediaPlugin } from "./plugins/media-plugin";
import { ToolbarPlugin } from "./plugins/toolbar-plugin";

const theme: EditorThemeClasses = {
  paragraph: "mb-1 relative",
  quote: "border-l-4 border-gray-300 pl-4 italic my-2",
  heading: {
    h1: "text-4xl font-bold my-3",
    h2: "text-3xl font-bold my-2",
    h3: "text-2xl font-bold my-2",
    h4: "text-xl font-bold my-2",
    h5: "text-lg font-bold my-1",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal ml-4 my-2",
    ul: "list-disc ml-4 my-2",
    listitem: "my-1",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-900 dark:bg-gray-100 text-background px-1 py-0.5 rounded font-mono text-sm",
  },
  image: "editor-image",
};

const placeholder = "Escribe algo increíble...";

function onError(error: Error) {
  throw error;
}

export function RichTextEditor() {
  const editorConfig = {
    namespace: "RichTextEditor",
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
      MediaNode,
    ],
    onError,
    theme,
  };

  return (
    <div className="relative rounded-lg border">
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="max-h-125 min-h-50 overflow-auto p-4 outline-none"
                aria-placeholder={placeholder}
                placeholder={<div />}
              />
            }
            placeholder={
              <div className="pointer-events-none absolute top-4 left-4 select-none text-muted-foreground">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <MediaPlugin />
          <DragDropPastePlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
