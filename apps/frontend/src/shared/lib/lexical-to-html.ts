import { createHeadlessEditor } from "@lexical/headless";
import { $generateHtmlFromNodes } from "@lexical/html";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { Window } from "happy-dom";
import type { SerializedEditorState } from "lexical";

export function lexicalToHtml(
  serializedState: string | SerializedEditorState,
): string {
  // Crear DOM simulado
  const window = new Window();
  const document = window.document;

  // Asignar globals temporalmente
  (globalThis as any).window = window;
  (globalThis as any).document = document;

  const editor = createHeadlessEditor({
    namespace: "ssr",
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
    ],
    onError: (error) => {
      throw error;
    },
  });

  const editorState =
    typeof serializedState === "string"
      ? JSON.parse(serializedState)
      : serializedState;

  editor.setEditorState(editor.parseEditorState(editorState));

  let html = "";

  editor.update(() => {
    html = $generateHtmlFromNodes(editor, null);
  });

  return html;
}

export function isValidLexicalJson(content: string): boolean {
  try {
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === "object" && "root" in parsed;
  } catch {
    return false;
  }
}
