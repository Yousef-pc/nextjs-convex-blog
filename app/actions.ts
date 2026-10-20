"use server";

import { z } from "zod";
import { blogSchema } from "./schemas/blog";
import { api } from "@/convex/_generated/api";
import { fetchAuthMutation } from "@/lib/auth-server";
import { updateTag } from "next/cache";

export async function createBlogAction(values: z.infer<typeof blogSchema>) {
  try {
    const parsed = blogSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("Something Went wrong");
    }

    const imageUrl = await fetchAuthMutation(api.posts.generateImageUploadUrl, {});

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      }
    }

    const { storageId } = await uploadResult.json();

    await fetchAuthMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      }
    );

    updateTag("blog-posts");
  } catch {
    return {
      error: "Failed to create post",
    }
  }
}