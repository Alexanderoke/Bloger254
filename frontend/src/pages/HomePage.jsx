import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listPosts } from "../api.js";
import PostCard from "../components/PostCard.jsx";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [text, setText] = useState(q);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setText(q);
    let cancelled = false;
    setLoading(true);
    setError("");

    listPosts(q)
      .then((data) => !cancelled && setPosts(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [q]);

  function handleSearch(e) {
    e.preventDefault();
    const trimmed = text.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  }

  return (
    <section>
      <form className="search" onSubmit={handleSearch}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="search posts..."
          aria-label="Search posts"
        />
        <button className="btn" type="submit">
          Search
        </button>
      </form>
      {loading && <p className="notice">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="notice">
          {q ? `No posts match "${q}".` : "No posts yet. Write the first one!"}
        </p>
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );  
}