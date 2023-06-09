import prismaClient from "../lib/prismadb";

export interface IPostParams {
  keyword?: string;
  tag?: string;
}

export default async function getSearchResults(params: IPostParams) {
  try {
    const { keyword, tag } = params;

    if (!keyword && !tag) {
      return null;
    }

    const posts = await prismaClient.post.findMany({
      where: {
        AND: [
          {
            OR: [
              keyword
                ? {
                    title: {
                      contains: keyword,
                      mode: "insensitive",
                    },
                  }
                : {},
              keyword
                ? {
                    content: {
                      contains: keyword,
                      mode: "insensitive",
                    },
                  }
                : {},
            ],
          },
          tag
            ? {
                tags: {
                  has: tag,
                },
              }
            : {},
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });

    const safePosts = posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: {
        id: post.author.id,
        name: post.author.name,
        image: post.author.image,
      },
    }));

    return safePosts;
  } catch (e: any) {
    return null;
  }
}
