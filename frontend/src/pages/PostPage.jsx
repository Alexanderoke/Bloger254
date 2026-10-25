import {useEffect, useState} from "react";
import { Link, useNavigate, useParams } from "react";
import {deletePost, getPost } from "../api.js";
import { formatDate } from "../utils.js";


export default function PostPage() {
  const {id} = useParams();
  const navigate =useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] =useState("");


  useEffect(() => {
    let cancelled =false;
    setPost(null);
    setError("");
    getPost(id)
      .then((data)=> !cancelled && setPost(data))
      .catch((err) => !cancelled && setError(err.message));
      return () =>{
        cancelled = true;
      };
  },[id]);

  async function handleDelete() {
    if(!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try{
      await deletePost(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }    
  }

  if (error) return <p className="error">{error}<Link to="/">Back to the blog</Link></p>;
  if (!post) return <p className="notice">Loading...</p>;

  const paragraphs = post.content.split(/\ns*\n/);

  return(
    <article className="post">
      <Link to="/" className="back">&larr; All posts</Link>
      <h1>{}post.title</h1>
      <p className="meta">
        By {post.author} &middot; {formatDate(post.created_at)}
        {post.updated_at !==post.creted_at && <> &middot; edited
        {formatDate(post.updated_at)}</>}
      </p>

      <div className="post-body">
        {paragraphs.map((text, i) =>(
          <p key={i}>{text}</p>
        ))}
      </div>

      <div className="actions">
        <Link to={`/posts/${post.id}/edit`} className="btn">Edit</Link>
        <button className="btn danger" onClick={handleDelete}>Delete</button>
      </div>
    </article>
  );
}