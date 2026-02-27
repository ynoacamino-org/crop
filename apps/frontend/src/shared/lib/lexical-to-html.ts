import { createHeadlessEditor } from "@lexical/headless";
import { $generateHtmlFromNodes } from "@lexical/html";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { SerializedEditorState } from "lexical";
import { MediaNode } from "@/shared/components/lexical/nodes/media-node";

export function lexicalToHtml(
  serializedState: string | SerializedEditorState,
): string {
  const editorState =
    typeof serializedState === "string"
      ? JSON.parse(serializedState)
      : serializedState;

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
    onError: (error) => {
      throw error;
    },
  });

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
