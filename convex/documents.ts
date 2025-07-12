import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>
                q
                    .eq("userId", userId)
                    .eq("parentDocument", args.parentDocument),
            )
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();
        return documents;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;
        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });
        return document;
    },
});

export const getArchivedDocuments = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), true))
            .order("desc")
            .collect();
        return documents;
    },
});

export const archive = mutation({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;
        const exisitingDocument = await ctx.db.get(args.id);
        if (!exisitingDocument) {
            throw new Error("Document not found");
        }
        if (exisitingDocument.userId !== userId) {
            throw new Error("Unauthorized to archive this document");
        }
        const recursiveArchive = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>
                    q.eq("userId", userId).eq("parentDocument", documentId),
                )
                .collect();
            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });
                await recursiveArchive(child._id);
            }
        };
        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });
        await recursiveArchive(args.id);
        return document;
    },
});

export const restore = mutation({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;
        const exisitingDocument = await ctx.db.get(args.id);
        if (!exisitingDocument) {
            throw new Error("Document not found");
        }
        if (exisitingDocument.userId !== userId) {
            throw new Error("Unauthorized to restore this document");
        }
        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>
                    q.eq("userId", userId).eq("parentDocument", documentId),
                )
                .collect();
            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                });
                await recursiveRestore(child._id);
            }
        };

        const options: Partial<Doc<"documents">> = {
            isArchived: false,
        };
        if (exisitingDocument.parentDocument) {
            const parent = await ctx.db.get(exisitingDocument.parentDocument);
            if (parent?.isArchived) {
                options.parentDocument = undefined;
            }
        }
        const document = await ctx.db.patch(args.id, options);

        await recursiveRestore(args.id);

        return document;
    },
});

export const remove = mutation({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;
        const exisitingDocument = await ctx.db.get(args.id);
        if (!exisitingDocument) {
            throw new Error("Document not found");
        }
        if (exisitingDocument.userId !== userId) {
            throw new Error("Unauthorized to remove this document");
        }
        await ctx.db.delete(args.id);
    },
});

export const getSearchResults = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();
        return documents;
    },
});

export const getDocumentById = query({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;
        const document = await ctx.db.get(args.id);
        if (!document) {
            throw new Error("Document not found");
        }

        if (document.isPublished && !document.isArchived) {
            return document;
        }

        if (document.userId !== userId) {
            throw new Error("Unauthorized to access this document");
        }
        return document;
    },
});

export const updateDocument = mutation({
    args: {
        id: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;
        const { id, ...rest } = args;
        const existingDocument = await ctx.db.get(id);
        if (!existingDocument) {
            throw new Error("Document not found");
        }
        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized to update this document");
        }
        const updatedDocument = await ctx.db.patch(id, {
            ...rest,
        });
        return updatedDocument;
    },
});
