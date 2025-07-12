"use client";

import { useMutation } from "convex/react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

interface TitleProps {
    initialData: Doc<"documents">;
}

const Title = ({ initialData }: TitleProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const update = useMutation(api.documents.updateDocument);

    const [title, setTitle] = useState(
        initialData.title || "Untitled Document",
    );
    const [isEditing, setIsEditing] = useState(false);

    const enableInput = () => {
        setTitle(initialData.title);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(
                0,
                inputRef.current.value.length,
            );
        }, 0);
    };

    const diableInput = () => {
        setIsEditing(false);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        update({
            id: initialData._id,
            title: e.target.value || "Untitled Document",
        });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            diableInput();
        }
    };

    return (
        <div>
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={diableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    className="font-normal h-auto p-1"
                >
                    <span className="truncate">{initialData.title}</span>
                </Button>
            )}
        </div>
    );
};

Title.Skeleton = function TitleSkeleton() {
    return <Skeleton className="h-9 w-20 rounded-md" />;
};

export default Title;
