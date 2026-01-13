"use client";

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

import { DecoratorNode } from "lexical";
import dynamic from "next/dynamic";
import type React from "react";

const MediaComponentLazy = dynamic(() => import("./media-component"), {
  ssr: false,
  loading: () => null,
});

export type MediaType = "image" | "video" | "audio";

export interface MediaPayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number;
  caption?: string;
  mediaType: MediaType;
}

function convertMediaElement(domNode: Node): null | DOMConversionOutput {
  if (domNode.nodeName === "IMG") {
    const img = domNode as HTMLImageElement;
    if (img.src.startsWith("file:///")) {
      return null;
    }
    const { alt: altText, src, width, height } = img;
    const node = $createMediaNode({
      altText,
      height,
      src,
      width,
      mediaType: "image",
    });
    return { node };
  }

  if (domNode.nodeName === "VIDEO") {
    const video = domNode as HTMLVideoElement;
    if (video.src.startsWith("file:///")) {
      return null;
    }
    const { src, width, height } = video;
    const node = $createMediaNode({
      altText: "Video",
      height,
      src,
      width,
      mediaType: "video",
    });
    return { node };
  }

  if (domNode.nodeName === "AUDIO") {
    const audio = domNode as HTMLAudioElement;
    if (audio.src.startsWith("file:///")) {
      return null;
    }
    const { src } = audio;
    const node = $createMediaNode({
      altText: "Audio",
      src,
      mediaType: "audio",
    });
    return { node };
  }

  return null;
}

export type SerializedMediaNode = Spread<
  {
    altText: string;
    caption?: string;
    height?: number;
    maxWidth?: number;
    mediaType: MediaType;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

export class MediaNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __altText: string;
  __width: "inherit" | number;
  __height: "inherit" | number;
  __maxWidth: number;
  __caption?: string;
  __mediaType: MediaType;

  static getType(): string {
    return "media";
  }

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

  exportDOM(): DOMExportOutput {
    if (this.__mediaType === "image") {
      const element = document.createElement("img");
      element.setAttribute("src", this.__src);
      element.setAttribute("alt", this.__altText);
      if (this.__width !== "inherit") {
        element.setAttribute("width", this.__width.toString());
      }
      if (this.__height !== "inherit") {
        element.setAttribute("height", this.__height.toString());
      }
      return { element };
    }

    if (this.__mediaType === "video") {
      const element = document.createElement("video");
      element.setAttribute("src", this.__src);
      element.setAttribute("controls", "true");
      if (this.__width !== "inherit") {
        element.setAttribute("width", this.__width.toString());
      }
      if (this.__height !== "inherit") {
        element.setAttribute("height", this.__height.toString());
      }
      return { element };
    }

    if (this.__mediaType === "audio") {
      const element = document.createElement("audio");
      element.setAttribute("src", this.__src);
      element.setAttribute("controls", "true");
      return { element };
    }

    const element = document.createElement("div");
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertMediaElement,
        priority: 0,
      }),
      video: () => ({
        conversion: convertMediaElement,
        priority: 0,
      }),
      audio: () => ({
        conversion: convertMediaElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    mediaType: MediaType,
    maxWidth: number,
    width?: "inherit" | number,
    height?: "inherit" | number,
    caption?: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__mediaType = mediaType;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__caption = caption;
  }

  exportJSON(): SerializedMediaNode {
    return {
      altText: this.getAltText(),
      caption: this.__caption,
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      mediaType: this.__mediaType,
      src: this.getSrc(),
      type: "media",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
    };
  }

  setWidthAndHeight(
    width: "inherit" | number,
    height: "inherit" | number,
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setCaption(caption: string): void {
    const writable = this.getWritable();
    writable.__caption = caption;
  }

  getMediaType(): MediaType {
    return this.__mediaType;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
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
