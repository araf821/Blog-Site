import Heading from "@/app/components/Heading";
import PostCard from "@/app/components/PostCard";
import { SafePost } from "@/app/types";
import { FC } from "react";

interface MoreFromAuthorProps {
  posts: SafePost[];
  authorName: string;
}

const MoreFromAuthor: FC<MoreFromAuthorProps> = ({ posts, authorName }) => {
  return (
    <section className="">
      <Heading title={authorName} small />
      <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>
    </section>
  );
};

export default MoreFromAuthor;
