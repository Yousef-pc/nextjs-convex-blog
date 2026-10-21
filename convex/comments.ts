import { v } from "convex/values";
import { query } from "./_generated/server";

export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts")
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("comments")
      .filter((q) => {
        return q.eq(q.field("postId"), args.postId)
      })
      .order("desc")
      .collect();
    return data;
  }
});