"use client";

import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (
    format: "bold" | "italic" | "underline" | "strikethrough" | "code",
  ) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatAlignment = (
    alignment: "left" | "center" | "right" | "justify",
  ) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-background p-2">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        aria-label="Deshacer"
        type="button"
        tooltip="Deshacer"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        aria-label="Rehacer"
        type="button"
        tooltip="Rehacer"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Text Formatting */}
      <Button
        variant={isBold ? "secondary" : "ghost"}
        size="sm"
        onClick={() => formatText("bold")}
        aria-label="Negrita"
        type="button"
        tooltip="Negrita"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={isItalic ? "secondary" : "ghost"}
        size="sm"
        onClick={() => formatText("italic")}
        aria-label="Cursiva"
        type="button"
        tooltip="Cursiva"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={isUnderline ? "secondary" : "ghost"}
        size="sm"
        onClick={() => formatText("underline")}
        aria-label="Subrayado"
        type="button"
        tooltip="Subrayado"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant={isStrikethrough ? "secondary" : "ghost"}
        size="sm"
        onClick={() => formatText("strikethrough")}
        aria-label="Tachado"
        type="button"
        tooltip="Tachado"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant={isCode ? "secondary" : "ghost"}
        size="sm"
        onClick={() => formatText("code")}
        aria-label="Código inline"
        type="button"
        tooltip="Código inline"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h1")}
        aria-label="Título 1"
        type="button"
        tooltip="Título 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h2")}
        aria-label="Título 2"
        type="button"
        tooltip="Título 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h3")}
        aria-label="Título 3"
        type="button"
        tooltip="Título 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Lista desordenada"
        type="button"
        tooltip="Lista desordenada"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Lista ordenada"
        type="button"
        tooltip="Lista ordenada"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Block Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={formatQuote}
        aria-label="Cita"
        type="button"
        tooltip="Cita"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatAlignment("left")}
        aria-label="Alinear izquierda"
        type="button"
        tooltip="Alinear izquierda"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatAlignment("center")}
        aria-label="Alinear centro"
        type="button"
        tooltip="Alinear centro"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatAlignment("right")}
        aria-label="Alinear derecha"
        type="button"
        tooltip="Alinear derecha"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatAlignment("justify")}
        aria-label="Justificar"
        type="button"
        tooltip="Justificar"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </div>
  );
}
