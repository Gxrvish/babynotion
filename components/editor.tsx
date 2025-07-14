"use client";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

import type { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
    onChange: (content: string) => void;
    initialContent?: string;
    editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
    const { resolvedTheme } = useTheme();
    const { edgestore } = useEdgeStore();

    const handleUpload = async (file: File) => {
        const res = await edgestore.publicFiles.upload({ file });
        return res.url;
    };

    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent
            ? (JSON.parse(initialContent) as PartialBlock[])
            : undefined,
        uploadFile: handleUpload,
    });

    return (
        <BlockNoteView
            editor={editor}
            editable={editable}
            onChange={async (editor) => {
                const content = await editor.document;
                onChange(JSON.stringify(content, null, 2));
            }}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
    );
};

export default Editor;
