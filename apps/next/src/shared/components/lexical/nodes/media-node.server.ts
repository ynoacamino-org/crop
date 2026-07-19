import type { DOMConversionMap, LexicalNode } from "lexical";

import {
  createMediaImportDOM,
  MediaNodeBase,
  type MediaPayload,
  type MediaType,
  type SerializedMediaNode,
} from "@/shared/components/lexical/nodes/media-node.core";

export type { MediaPayload, MediaType, SerializedMediaNode };

export class MediaNode extends MediaNodeBase<HTMLElement> {
  static clone(node: MediaNode): MediaNode {
    return new MediaNode(
      node.__src,
      node.__altText,
      node.__mediaType,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__caption,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedMediaNode): MediaNode {
    const { altText, height, width, maxWidth, caption, src, mediaType } =
      serializedNode;
    const node = $createMediaNode({
      altText,
      height,
      maxWidth,
      src,
      width,
      caption,
      mediaType,
    });
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return createMediaImportDOM($createMediaNode);
  }

  decorate(): HTMLElement {
    // Server-side placeholder - exportDOM handles actual HTML generation
    const element = document.createElement("span");
    return element;
  }
}

export function $createMediaNode({
  altText,
  height,
  maxWidth = 500,
  caption,
  src,
  width,
  key,
  mediaType,
}: MediaPayload): MediaNode {
  return new MediaNode(
    src,
    altText,
    mediaType,
    maxWidth,
    width,
    height,
    caption,
    key,
  );
}

export function $isMediaNode(
  node: LexicalNode | null | undefined,
): node is MediaNode {
  return node instanceof MediaNode;
}
