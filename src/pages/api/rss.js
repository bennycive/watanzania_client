import { GET_RSS_FEED_BY_ID } from "@/utils/api/api";
import { Feed } from "feed";
export default async function generateRssFeed(allPosts) {

  let fs;
  if (typeof window === "undefined") {
    fs = require("fs");
  } else {
    // Early return if we're in the browser
    console.warn("generateRssFeed was called in browser environment where fs is unavailable");
    return;
  }


  const siteURL = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

  const date = new Date();

  const posts = allPosts?.data;

  const feed = new Feed({
    title: process.env.NEXT_PUBLIC_TITLE,
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
    id: siteURL,
    link: siteURL || "http://localhost:3000",
    copyright: `All rights reserved ${date.getFullYear()}`,
    pubDate: new Date(),
    feedLinks: {
      rss2: `${siteURL}/rssfeed.xml`,
      json: `${siteURL}/rssfeed.json`
    },
  });

  posts.map((post) => {
    const url = `${siteURL}/${GET_RSS_FEED_BY_ID}/${post?.id}`;
    feed.addItem({
      title: post.feed_name,
      description: post.description,
      guid: url,
      link: url,
      category: post.category?.category_name,
      date: new Date(),
    });
  });

  // fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rssfeed.xml", feed.rss2());
  fs.writeFileSync("./public/rssfeed.json", feed.json1());
}