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

// Shared conversion function
export function convertMediaElement(
  domNode: Node,
  createNodeFn: (payload: MediaPayload) => LexicalNode,
): null | DOMConversionOutput {
  if (domNode.nodeName === "IMG") {
    const img = domNode as HTMLImageElement;
    if (img.src.startsWith("file:///")) {
      return null;
    }
    const { alt: altText, src, width, height } = img;
    const node = createNodeFn({
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
    const node = createNodeFn({
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
    const node = createNodeFn({
      altText: "Audio",
      src,
      mediaType: "audio",
    });
    return { node };
  }

  return null;
}

// Shared DOM import map factory
export function createMediaImportDOM(
  createNodeFn: (payload: MediaPayload) => LexicalNode,
): DOMConversionMap {
  return {
    img: () => ({
      conversion: (node) => convertMediaElement(node, createNodeFn),
      priority: 0,
    }),
    video: () => ({
      conversion: (node) => convertMediaElement(node, createNodeFn),
      priority: 0,
    }),
    audio: () => ({
      conversion: (node) => convertMediaElement(node, createNodeFn),
      priority: 0,
    }),
  };
}

// Shared exportDOM logic
export function exportMediaDOM(
  mediaType: MediaType,
  src: string,
  altText: string,
  width: "inherit" | number,
  height: "inherit" | number,
): DOMExportOutput {
  if (mediaType === "image") {
    const element = document.createElement("img");
    element.setAttribute("src", src);
    element.setAttribute("alt", altText);
    if (width !== "inherit") {
      element.setAttribute("width", width.toString());
    }
    if (height !== "inherit") {
      element.setAttribute("height", height.toString());
    }
    return { element };
  }

  if (mediaType === "video") {
    const element = document.createElement("video");
    element.setAttribute("src", src);
    element.setAttribute("controls", "true");
    if (width !== "inherit") {
      element.setAttribute("width", width.toString());
    }
    if (height !== "inherit") {
      element.setAttribute("height", height.toString());
    }
    return { element };
  }

  if (mediaType === "audio") {
    const element = document.createElement("audio");
    element.setAttribute("src", src);
    element.setAttribute("controls", "true");
    return { element };
  }

  const element = document.createElement("div");
  return { element };
}

// Shared exportJSON logic
export function exportMediaJSON(
  altText: string,
  caption: string | undefined,
  height: "inherit" | number,
  maxWidth: number,
  mediaType: MediaType,
  src: string,
  width: "inherit" | number,
): SerializedMediaNode {
  return {
    altText,
    caption,
    height: height === "inherit" ? 0 : height,
    maxWidth,
    mediaType,
    src,
    type: "media",
    version: 1,
    width: width === "inherit" ? 0 : width,
  };
}

// Shared createDOM logic
export function createMediaDOM(config: EditorConfig): HTMLElement {
  const span = document.createElement("span");
  const theme = config.theme;
  const className = theme.image;
  if (className !== undefined) {
    span.className = className;
  }
  return span;
}

// Base class with all shared logic
export abstract class MediaNodeBase<T> extends DecoratorNode<T> {
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

  constructor(
    src = "",
    altText = "",
    mediaType: MediaType = "image",
    maxWidth = 500,
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

  exportDOM(): DOMExportOutput {
    return exportMediaDOM(
      this.__mediaType,
      this.__src,
      this.__altText,
      this.__width,
      this.__height,
    );
  }

  exportJSON(): SerializedMediaNode {
    return exportMediaJSON(
      this.getAltText(),
      this.__caption,
      this.__height,
      this.__maxWidth,
      this.__mediaType,
      this.getSrc(),
      this.__width,
    );
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

  createDOM(config: EditorConfig): HTMLElement {
    return createMediaDOM(config);
  }

  updateDOM(): false {
    return false;
  }

  isInline(): boolean {
    return true;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  // Abstract method to be implemented by client/server
  abstract decorate(): T;
}
