import getCurrentUser from "@/app/actions/getCurrentUser";
import prismaClient from "@/app/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { title, content, imgSrc: image, category, published, slug } = body;

  const post = await prismaClient.post.create({
    data: {
      title,
      content,
      image,
      slug,
      category,
      published,
      authorId: currentUser.id,
    },
  });

  return NextResponse.json(post);
}