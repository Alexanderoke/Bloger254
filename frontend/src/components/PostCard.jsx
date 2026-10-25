import { Link} from "react-router-dom";
import {formatDate} from "../utils.js";

export default function PostCard({post}) {
  return(
    <article className="post-card">
      <h2>
        {/* Clicking the title opens the full post */}
        <Link to={`/posts/${post.id}`}>{}post.title</Link>
      </h2>
      <p className="meta">
        By {post.author} &middot; {formatDate(post.created_at)}
      </p>
      <p>{post.excerpt}</p>
      <Link to ={`/posts/${post.id}`} ClassName="read-more">Read more</Link>
    </article>
  );
}