"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

const DocumentsPage = () => {
    const { user } = useUser();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({
            title: "Untitled",
        });

        toast.promise(promise, {
            loading: "Creating document...",
            success: "Document created successfully!",
            error: (error) => `Error creating document: ${error.message}`,
        });
    };

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/empty.svg"
                alt="No documents found"
                width="300"
                height="300"
                className="dark:hidden"
            />
            <Image
                src="/empty-dark.svg"
                alt="No documents found"
                width="300"
                height="300"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Welcome to {user?.firstName || "Your"}&apos;s Documents Page
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-1" />
                <span className="">Create document</span>
            </Button>
        </div>
    );
};

export default DocumentsPage;
