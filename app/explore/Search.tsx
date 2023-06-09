"use client";

import { FC, useCallback, useState } from "react";
import { SafePost } from "../types";
import PostCard from "../components/PostCard";
import Button from "../components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { AnimatePresence, motion } from "framer-motion";
import { AiFillFilter } from "react-icons/ai";
import { options } from "../post/write/PostForm";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  posts: SafePost[] | null;
}

const Search: FC<SearchBarProps> = ({ posts }) => {
  const [keyword, setKeyword] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const router = useRouter();
  const params = useSearchParams();

  const handleSearch = useCallback(async () => {
    let currentQuery: any = {};

    if (params) {
      currentQuery = queryString.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      keyword,
      tag: selectedTag,
    };

    const url = queryString.stringifyUrl(
      {
        url: "/explore",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    router.push(url);
  }, [params, keyword, selectedTag, router]);

  return (
    <motion.section animate={{ height: "auto" }}>
      {/* Search bar */}
      <div className="relative grid w-full gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="sm:col-span-2 md:col-span-3 lg:col-span-4"
        >
          <input
            id="name"
            type="text"
            placeholder=" "
            autoFocus
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            className={`peer w-full rounded-md border-2 px-4 py-3`}
          />
          <label
            className={`absolute left-3 top-3 origin-left -translate-y-6 scale-75  select-none rounded-md bg-bg px-2 text-neutral-500 transition peer-placeholder-shown:left-3 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:text-neutral-800`}
          >
            Search
          </label>
        </form>
        <div className="flex items-center gap-1.5">
          <div
            className={`grid h-full cursor-pointer place-items-center rounded-sm p-2 shadow-inner transition duration-500 hover:text-accent hover:shadow-accent ${
              isFiltersOpen
                ? "text-accent shadow-accent"
                : "text-zinc-700 shadow-zinc-600"
            }`}
            onClick={() => setIsFiltersOpen((isOpen) => !isOpen)}
          >
            <AiFillFilter className="text-3xl" />
          </div>
          {selectedTag || keyword ? (
            <Button
              icon={FaSearch}
              className="h-full sm:col-span-1"
              special
              onClick={handleSearch}
            />
          ) : (
            <Button
              icon={FaSearch}
              className="h-full sm:col-span-1"
              special
              disabled
              onClick={handleSearch}
            />
          )}
        </div>
      </div>

      {/* Filters */}

      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            className="mt-2 w-full font-josefin"
            initial={{ height: 0, opacity: 0 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.3 },
            }}
          >
            <p className="text-xl font-semibold text-zinc-700">Filters</p>
            <hr />
            <p className="py-2">TAGS</p>
            <div className="max-w-96 grid grid-cols-2 items-center gap-x-2 gap-y-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {options.map((tag) => (
                <span
                  onClick={() => {
                    selectedTag === tag.label
                      ? setSelectedTag("")
                      : setSelectedTag(tag.label);
                      
                  }}
                  className={`${
                    tag.label === selectedTag
                      ? "scale-105 bg-primary text-white opacity-100"
                      : "hover:translate-x-1 hover:bg-blue-200"
                  } cursor-pointer py-1 text-lg font-light transition duration-300 lg:text-xl`}
                  key={tag.label}
                >
                  | {tag.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search results */}
      {posts?.length ? (
        <section className="space-y-2 py-4">
          <hr />
          <p className="font-josefin font-light sm:text-lg md:text-xl">
            {posts.length} {posts.length > 1 ? "Results" : "Result"} Found
          </p>
          <div
            className={`grid w-full origin-top grid-cols-1 gap-6 transition duration-1000 md:grid-cols-2 lg:grid-cols-3`}
          >
            {posts?.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}
          </div>
        </section>
      ) : (
        posts?.length === 0 && (
          <div className="my-4 grid h-32 w-full place-content-center rounded-lg text-center text-lg lg:text-2xl">
            No results found under the search criteria.
          </div>
        )
      )}
    </motion.section>
  );
};

export default Search;
