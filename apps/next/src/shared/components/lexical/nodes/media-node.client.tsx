"use client";

import type { DOMConversionMap, LexicalNode } from "lexical";

import dynamic from "next/dynamic";
import type React from "react";
import {
  createMediaImportDOM,
  MediaNodeBase,
  type MediaPayload,
  type MediaType,
  type SerializedMediaNode,
} from "./media-node.core";

const MediaComponentLazy = dynamic(() => import("./media-component"), {
  ssr: false,
  loading: () => null,
});

export type { MediaType, MediaPayload, SerializedMediaNode };

export class MediaNode extends MediaNodeBase<React.ReactElement> {
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

  decorate(): React.ReactElement {
    return (
      <MediaComponentLazy
        src={this.__src}
        altText={this.__altText}
        mediaType={this.__mediaType}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        caption={this.__caption}
      />
    );
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
