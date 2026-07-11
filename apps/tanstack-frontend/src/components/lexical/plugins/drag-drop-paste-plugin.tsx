"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW, DRAGOVER_COMMAND, DROP_COMMAND } from "lexical";
import { useEffect } from "react";

import { uploadMedia } from "./media-plugin";

const ACCEPTABLE_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const ACCEPTABLE_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const ACCEPTABLE_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
];

const ACCEPTABLE_MEDIA_TYPES = [
  ...ACCEPTABLE_IMAGE_TYPES,
  ...ACCEPTABLE_VIDEO_TYPES,
  ...ACCEPTABLE_AUDIO_TYPES,
];

function isMediaFile(type: string): boolean {
  return ACCEPTABLE_MEDIA_TYPES.some(
    (acceptedType) => type.startsWith(acceptedType) || type === acceptedType,
  );
}

export default function DragDropPastePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      DRAGOVER_COMMAND,
      (event) => {
        event.preventDefault();
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      DROP_COMMAND,
      (event) => {
        event.preventDefault();
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const items = Array.from(clipboardData.items);
      for (const item of items) {
        if (isMediaFile(item.type)) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            uploadMedia(editor, file);
            return;
          }
        }
      }
    };

    const handleDrop = (event: DragEvent) => {
      const files = event.dataTransfer?.files;
      if (!files) return;

      const filesArray = Array.from(files);
      for (const file of filesArray) {
        if (isMediaFile(file.type)) {
          event.preventDefault();
          uploadMedia(editor, file);
          return;
        }
      }
    };

    const editorElement = editor.getRootElement();
    if (editorElement) {
      editorElement.addEventListener("paste", handlePaste);
      editorElement.addEventListener("drop", handleDrop);
      editorElement.addEventListener("dragover", (e) => e.preventDefault());

      return () => {
        editorElement.removeEventListener("paste", handlePaste);
        editorElement.removeEventListener("drop", handleDrop);
        editorElement.removeEventListener("dragover", (e) =>
          e.preventDefault(),
        );
      };
    }
  }, [editor]);

  return null;
}
