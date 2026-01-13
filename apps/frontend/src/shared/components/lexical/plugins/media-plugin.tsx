"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement } from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalCommand,
  type LexicalEditor,
} from "lexical";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { service } from "@/service/service.client";
import {
  $createMediaNode,
  $isMediaNode,
  type MediaPayload,
  type MediaType,
} from "../nodes/media-node";

export type InsertMediaPayload = Readonly<MediaPayload>;

export const INSERT_MEDIA_COMMAND: LexicalCommand<InsertMediaPayload> =
  createCommand("INSERT_MEDIA_COMMAND");

export function MediaPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (
      !editor.hasNodes([
        /* MediaNode will be registered in the editor config */
      ])
    ) {
      throw new Error("MediaPlugin: MediaNode not registered on editor");
    }

    return editor.registerCommand<InsertMediaPayload>(
      INSERT_MEDIA_COMMAND,
      (payload) => {
        const mediaNode = $createMediaNode(payload);
        $insertNodes([mediaNode]);
        if ($isRootOrShadowRoot(mediaNode.getParentOrThrow())) {
          $wrapNodeInElement(mediaNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

function getMediaTypeFromFile(file: File): MediaType {
  if (file.type.startsWith("image/")) {
    return "image";
  }
  if (file.type.startsWith("video/")) {
    return "video";
  }
  if (file.type.startsWith("audio/")) {
    return "audio";
  }
  return "image"; // default fallback
}

export async function uploadMedia(
  editor: LexicalEditor,
  file: File,
): Promise<void> {
  const mediaType = getMediaTypeFromFile(file);

  try {
    // Mostrar preview mientras se sube
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const dataUrl = reader.result as string;

      // Insertar media temporal con data URL
      const tempPayload: MediaPayload = {
        altText: file.name,
        src: dataUrl,
        mediaType,
      };

      editor.dispatchCommand(INSERT_MEDIA_COMMAND, tempPayload);

      try {
        // Subir media al servidor
        const response = await service.rest.media.upload(file, {
          alt: file.name,
          prefix: "posts",
        });

        // Actualizar el media con la URL real del servidor
        editor.update(() => {
          const nodes = editor.getEditorState()._nodeMap;
          for (const [key, node] of nodes) {
            if ($isMediaNode(node) && node.getSrc() === dataUrl) {
              const mediaNode = $createMediaNode({
                altText: response.data.alt || file.name,
                src: response.data.url,
                mediaType,
                maxWidth:
                  mediaType === "image" || mediaType === "video" ? 800 : 500,
              });

              // Reemplazar el nodo temporal con el real
              const oldNode = $getNodeByKey(key);
              if (oldNode && $isMediaNode(oldNode)) {
                oldNode.replace(mediaNode);
              }
              break;
            }
          }
        });

        toast.success(
          `${mediaType === "image" ? "Imagen" : mediaType === "video" ? "Video" : "Audio"} subido correctamente`,
        );
      } catch (_error) {
        toast.error("Error al subir el archivo");
      }
    };
  } catch (_error) {
    toast.error("Error al procesar el archivo");
  }
}

export function InsertMediaDialog({
  activeEditor,
  onClose,
  mediaType = "image",
}: {
  activeEditor: LexicalEditor;
  mediaType?: MediaType;
  onClose: () => void;
}): React.ReactElement {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  const handleSubmit = () => {
    if (!isDisabled) {
      activeEditor.dispatchCommand(INSERT_MEDIA_COMMAND, {
        altText,
        src,
        mediaType,
      });
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="media-src" className="font-medium text-sm">
          URL del{" "}
          {mediaType === "image"
            ? "imagen"
            : mediaType === "video"
              ? "video"
              : "audio"}
        </label>
        <input
          id="media-src"
          type="text"
          placeholder={`https://ejemplo.com/${mediaType === "image" ? "imagen.jpg" : mediaType === "video" ? "video.mp4" : "audio.mp3"}`}
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="media-alt" className="font-medium text-sm">
          Texto alternativo
        </label>
        <input
          id="media-alt"
          type="text"
          placeholder={`Descripción del ${mediaType === "image" ? "imagen" : mediaType === "video" ? "video" : "audio"}`}
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border px-4 py-2"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          Insertar
        </button>
      </div>
    </div>
  );
}
