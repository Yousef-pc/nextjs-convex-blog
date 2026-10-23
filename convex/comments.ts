import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts")
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => {
        return q.eq("postId", args.postId);
      })
      .order("desc")
      .collect();
    return data;
  }
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    // Checking wether the post exists or not:
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new ConvexError("Post not found");
    }

    return await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: user._id,
      authorName: user.name,
      body: args.body,
    })
  }
})