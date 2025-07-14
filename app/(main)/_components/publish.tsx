"use client";

import { useMutation } from "convex/react";
import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useOrigin from "@/hooks/use-origin";

interface PublishProps {
    initialData: Doc<"documents">;
}

const Publish = ({ initialData }: PublishProps) => {
    const origin = useOrigin();
    const updateDocument = useMutation(api.documents.updateDocument);

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${initialData._id}`;

    const onPublish = async () => {
        setIsSubmitting(true);
        const promise = updateDocument({
            id: initialData._id,
            isPublished: !initialData.isPublished,
        }).finally(() => {
            setIsSubmitting(false);
        });
        toast.promise(promise, {
            loading: initialData.isPublished
                ? "Unpublishing document..."
                : "Publishing document...",
            success: () =>
                initialData.isPublished
                    ? "Document unpublished"
                    : "Document published",
            error: (error) => `Error updating document: ${error.message}`,
        });
    };

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    {initialData.isPublished ? "Unpublish" : "Publish"}
                    {initialData.isPublished && (
                        <Globe className="text-sky-500 ml-2 h-4 w-4" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72"
                align="end"
                alignOffset={8}
                forceMount
            >
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className="text-sky-500 h-4 w-4 animate-pulse" />
                            <p className="text-xs font-medium text-sky-500">
                                Document is published
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                                value={url}
                                disabled
                            />
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="h-8 rounded-l-none"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            onClick={onPublish}
                            disabled={isSubmitting}
                            className="w-full text-xs"
                        >
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe className="text-muted-foreground h-8 w-8 mb-2" />
                        <p className="text-sm font-medium mb-2">
                            Publish this document.
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Share your work with others by publishing it.
                        </span>
                        <Button
                            onClick={onPublish}
                            disabled={isSubmitting}
                            className="w-full text-xs"
                            size="sm"
                        >
                            {isSubmitting
                                ? "Publishing..."
                                : "Publish Document"}
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default Publish;
