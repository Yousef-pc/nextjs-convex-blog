import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { blogSchema } from "../app/schemas/blog";

export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const parsed = blogSchema.safeParse({
      title: args.title,
      content: args.body,
    });

    if (!parsed.success) {
      throw new ConvexError("Invalid input");
    }

    const blogArticle = await ctx.db.insert("posts", {
      title: parsed.data.title,
      body: parsed.data.content,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });

    return blogArticle;
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();

    return posts;
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    return ctx.storage.generateUploadUrl();
  }
})