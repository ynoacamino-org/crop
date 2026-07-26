import { createHeadlessEditor } from "@lexical/headless";
import { $generateHtmlFromNodes } from "@lexical/html";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { Window } from "happy-dom";
import type { SerializedEditorState } from "lexical";
import { MediaNode } from "@/components/lexical/nodes/media-node.ssr";

export function lexicalToHtml(
  serializedState: string | SerializedEditorState,
): string {
  try {
    const window = new Window();
    const document = window.document;

    window.SyntaxError = SyntaxError;
    window.TypeError = TypeError;
    window.RangeError = RangeError;
    window.ReferenceError = ReferenceError;

    (globalThis as Record<string, unknown>).window = window;
    (globalThis as Record<string, unknown>).document = document;

    const editor = createHeadlessEditor({
      namespace: "ssr",
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        MediaNode,
      ],
      onError: (_error) => {
        // Silenciar errores de Lexical en SSR
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
  } catch {
    return "<p>Error rendering content</p>";
  }
}

export function isValidLexicalJson(content: string): boolean {
  try {
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === "object" && "root" in parsed;
  } catch {
    return false;
  }
}
