"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface BannerProps {
    documentId: Id<"documents">;
}

const Banner = ({ documentId }: BannerProps) => {
    const router = useRouter();

    const removeDocument = useMutation(api.documents.remove);
    const restoreDocument = useMutation(api.documents.restore);

    const onRemove = () => {
        const promise = removeDocument({ id: documentId });
        toast.promise(promise, {
            loading: "Removing document...",
            success: "Document removed successfully",
            error: (error) => `Error removing document: ${error.message}`,
        });
        router.push("/documents");
    };

    const onRestore = () => {
        const promise = restoreDocument({ id: documentId });
        toast.promise(promise, {
            loading: "Restoring document...",
            success: "Document restored successfully",
            error: (error) => `Error restoring document: ${error.message}`,
        });
    };

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p className="">This page is in trash.</p>
            <Button
                size="sm"
                onClick={onRestore}
                variant="outline"
                className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore document
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete forever
                </Button>
            </ConfirmModal>
        </div>
    );
};

export default Banner;
