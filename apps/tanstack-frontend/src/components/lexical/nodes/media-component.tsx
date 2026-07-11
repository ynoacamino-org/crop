"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import type { NodeKey } from "lexical";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";

export type MediaType = "image" | "video" | "audio";

const imageCache = new Set<string>();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
      img.onerror = () => {
        resolve(null);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
}: {
  altText: string;
  className: string | null;
  height: "inherit" | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number;
  src: string;
  width: "inherit" | number;
}): React.ReactElement {
  useSuspenseImage(src);
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height,
        maxWidth,
        width,
      }}
      draggable="false"
    />
  );
}

function VideoPlayer({
  src,
  width,
  height,
  maxWidth,
}: {
  height: "inherit" | number;
  maxWidth: number;
  src: string;
  width: "inherit" | number;
}): React.ReactElement {
  return (
    <video
      controls
      src={src}
      style={{
        height,
        maxWidth,
        width,
      }}
      className="h-auto max-w-full"
    >
      <track kind="captions" />
    </video>
  );
}

function AudioPlayer({ src }: { src: string }): React.ReactElement {
  return (
    <audio controls src={src} className="w-full max-w-md">
      <track kind="captions" />
    </audio>
  );
}

export default function MediaComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  caption,
  mediaType,
}: {
  altText: string;
  caption?: string;
  height: "inherit" | number;
  maxWidth: number;
  mediaType: MediaType;
  nodeKey: NodeKey;
  src: string;
  width: "inherit" | number;
}): React.ReactElement {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        // MediaNode check - assuming it's a media node based on nodeKey
        if (node) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey],
  );

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload;

      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }

      return false;
    },
    [isSelected, setSelected, clearSelection],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, onClick, onDelete]);

  const renderMedia = () => {
    switch (mediaType) {
      case "image":
        return (
          <LazyImage
            className="h-auto max-w-full"
            src={src}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
            maxWidth={maxWidth}
          />
        );
      case "video":
        return (
          <VideoPlayer
            src={src}
            width={width}
            height={height}
            maxWidth={maxWidth}
          />
        );
      case "audio":
        return <AudioPlayer src={src} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className={`relative inline-block ${isSelected ? "ring-2 ring-primary" : ""}`}
      >
        {renderMedia()}
      </div>
      {caption && (
        <div className="mt-1 text-center text-muted-foreground text-sm italic">
          {caption}
        </div>
      )}
    </div>
  );
}
