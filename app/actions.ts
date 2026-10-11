"use server";

import { z } from "zod";
import { blogSchema } from "./schemas/blog";
import { api } from "@/convex/_generated/api";
import { fetchAuthMutation } from "@/lib/auth-server";

export async function createBlogAction(values: z.infer<typeof blogSchema>) {
  const parsed = blogSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Something Went wrong");
  }

  await fetchAuthMutation(
    api.posts.createPost,
    {
      title: parsed.data.title,
      body: parsed.data.content,
    }
  );
}