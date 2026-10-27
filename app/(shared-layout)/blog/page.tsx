import { buttonVariants } from '@/components/ui/button';
import { fetchQuery } from "convex/nextjs";
import { cacheTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import { Card, CardFooter, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export const instant = false;

export const metadata: Metadata = {
  title: "Blog | Next.js 16 toturial",
  description: "Read our latest articles and insights",
  category: "Web development",
  authors: [{ name: "Yousef Pc" }]
}

const BlogPage = async () => {
  // 1. Top-level page check (Dynamic - runs on every request)
  const token = await getToken();
  if (!token) {
    redirect("/auth/login");
  }

  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our Blog</h1>
        <p className="pt-4 mx-auto max-w-2xl text-xl text-muted-foreground">Insights, thoughts, and trends from our team.</p>
      </div>

      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogList />
      </Suspense>
    </div>
  )
}

async function LoadBlogList() {
  "use cache";
  cacheTag("blog-posts");

  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => {
        return (
          <Card key={post._id} className="pt-0">
            <div className="relative h-48 w-full overflow-hidden">
              <Image src={
                post.imageUrl ||
                "https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0"
              }
                alt="image"
                fill
                className='rounded-t-lg object-cover'
              />
            </div>

            <CardContent>
              <Link href={`/blog/${post._id}`}>
                <h1 className="text-2xl font-bold hover:text-primary">{post.title}</h1>
              </Link>

              <p className="text-lg text-muted-foreground line-clamp-3">{post.body}</p>
            </CardContent>

            <CardFooter className={buttonVariants(
              { className: "w-full", }
            )}>
              <Link className="w-full flex items-center justify-center" href={`/blog/${post._id}`}>
                Read more
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
}

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {
        [...Array(3)].map((_, i) => (
          <div className="flex flex-col space-y-3" key={i}>
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="space-y-2 flex flex-col">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        )
        )
      }
    </div>
  );
}

export default BlogPage;