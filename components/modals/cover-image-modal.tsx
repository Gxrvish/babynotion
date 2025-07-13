"use client";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import VisuallyHidden from "../ui/visually-hidden";
import { SingleImageDropzone } from "../upload/single-image";
import { UploaderProvider } from "../upload/uploader-provider";
interface UploadParams {
    file: File;
}

export const CoverImageModal = () => {
    const params = useParams();
    const update = useMutation(api.documents.updateDocument);
    const coverImage = useCoverImage();
    const { edgestore } = useEdgeStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onClose = () => {
        setIsSubmitting(false);
        coverImage.onClose();
    };

    const uploadFn = async ({ file }: UploadParams) => {
        const res = await edgestore.publicFiles.upload({
            file,
            options: {
                replaceTargetUrl: coverImage.url,
            },
        });
        try {
            setIsSubmitting(true);
            await update({
                id: params.documentId as Id<"documents">,
                coverImage: res.url,
            });
            onClose();
        } catch (err) {
            console.error("Error saving cover image URL:", err);
            setIsSubmitting(false);
        }
        return res;
    };

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <VisuallyHidden>
                    <DialogTitle></DialogTitle>
                </VisuallyHidden>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">
                        Cover Image
                    </h2>
                </DialogHeader>
                <UploaderProvider uploadFn={uploadFn} autoUpload>
                    <SingleImageDropzone
                        className="w-full outline-none"
                        disabled={isSubmitting}
                        height={200}
                        width={200}
                        dropzoneOptions={{
                            maxSize: 1024 * 1024 * 1,
                        }}
                    />
                </UploaderProvider>
            </DialogContent>
        </Dialog>
    );
};
