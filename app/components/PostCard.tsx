"use client";

import Image from "next/image";
import { FC, useState } from "react";
import { SafePost } from "../types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import MoreOptionsMenu from "./MoreOptionsMenu";
import { motion } from "framer-motion";

interface PostCardProps {
  main?: boolean;
  horizontal?: boolean;
  post?: SafePost;
  dashboard?: boolean;
}

const PostCard: FC<PostCardProps> = ({
  post = null,
  horizontal,
  main,
  dashboard,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!post) return null;

  const handleDelete = () => {
    setIsLoading(true);

    axios
      .delete(`/api/post/${post.id}`)
      .then(() => {
        toast.error("Post deleted!");
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleMove = () => {
    setIsLoading(true);

    axios
      .put(`/api/post/${post.id}`)
      .then(() => {
        toast.success(`${post.published ? "Moved to drafts!" : "Published!"}`);
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      className={`w-full max-w-[800px] transition duration-500 ${
        horizontal &&
        "md:flex md:h-full md:min-w-[350px] md:flex-grow lg:min-w-[500px]"
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{
          type: "spring",
          duration: 0.1,
          stiffness: 200,
          damping: 5,
        }}
        className="relative aspect-[5/4] w-full overflow-hidden rounded-lg shadow-sm"
      >
        <Image
          src={post.image}
          fill
          alt=""
          className="absolute rounded-lg object-cover"
        />
        {dashboard && (
          <MoreOptionsMenu
            post={post}
            onMove={handleMove}
            onDelete={handleDelete}
          />
        )}
      </motion.div>

      {/* Post Info */}
      <div
        className={`h-fit w-full p-2 text-center capitalize ${
          horizontal && "md:h-fit md:space-y-3 md:p-0 md:pl-2 md:text-start"
        }`}
      >
        <p
          className={`font-josefin text-2xl font-bold ${
            horizontal && "md:text-xl lg:text-[26px] xl:text-3xl"
          }
          ${main && "lg:text-[26px] xl:text-3xl"}`}
          onClick={() => router.push(`/post/${post.slug}`)}
        >
          <span className="cursor-pointer underline-offset-4 hover:underline">
            {post.title}
          </span>
        </p>
        {post ? (
          <p className={`text-lg font-light ${horizontal && "xl:text-xl"}`}>
            {post.author.name}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PostCard;
