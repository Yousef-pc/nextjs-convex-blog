import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";

interface postIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>
}

const PostIdRoute = async ({ params }: postIdRouteProps) => {
  const { postId } = await params;

  const [post, preloadedComments] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId: postId }),
    preloadQuery(
      api.comments.getCommentsByPostId,
      {
        postId: postId,
      }),
  ])

  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-extrabold text-red-500 py-20">
          No post found
        </h1>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link className={buttonVariants({ variant: "outline", className: "mb-4" })} href="/blog">
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0"
          }
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{post.title}</h1>

        <p className="text-sm text-muted-foreground">
          Created at: {new Date(post._creationTime).toLocaleDateString()}
        </p>
      </div>

      <Separator className="my-8" />

      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>

      <Separator className="my-8" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  )
}

export default PostIdRoute