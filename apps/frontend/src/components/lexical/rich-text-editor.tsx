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
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { EditorState, EditorThemeClasses } from "lexical";

import { MediaNode } from "@/components/lexical/nodes/media-node";
import DragDropPastePlugin from "@/components/lexical/plugins/drag-drop-paste-plugin";
import { MediaPlugin } from "@/components/lexical/plugins/media-plugin";
import { ToolbarPlugin } from "@/components/lexical/plugins/toolbar-plugin";

const theme: EditorThemeClasses = {
  paragraph: "mb-1 relative",
  quote:
    "border-l border-border/80 pl-4 italic my-2 text-muted-foreground bg-muted/30 py-1 rounded-r",
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
    code: "bg-muted text-foreground px-1.5 py-0.5 rounded font-mono text-sm border border-border/50",
  },
  image: "editor-image",
};

const placeholder = "Escribe algo increíble...";

function onError(error: Error) {
  throw error;
}

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: RichTextEditorProps) {
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
    editable: !disabled,
    editorState: value || undefined,
  };

  const handleChange = (editorState: EditorState) => {
    if (onChange && !disabled) {
      const json = JSON.stringify(editorState.toJSON());
      onChange(json);
    }
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
          <OnChangePlugin onChange={handleChange} />
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
