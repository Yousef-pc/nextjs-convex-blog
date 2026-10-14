"use client";

import { Card } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { CardContent } from '@/components/ui/card';
import Link from 'next/link';

const BlogPage = () => {
  const data = useQuery(api.posts.getPosts);

  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our Blog</h1>
        <p className="pt-4 mx-auto max-w-2xl text-xl text-muted-foreground">Insights, thoughts, and trends from our team.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((post) => {
          return (
            <Card key={post._id}>
              <div className="relative h-48 w-full overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0"
                  alt="image"
                  fill
                />
              </div>

              <CardContent>
                <Link href={`/blog/${post._id}`}>
                  <h1 className="text-2xl font-bold hover:text-primary">{post.title}</h1>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default BlogPage