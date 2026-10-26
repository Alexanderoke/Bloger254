import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPost, getPost, updatePost } from "../api.js";
import PostForm from "../components/PostForm.jsx";

export default function EditorPage() {
  const {id} =useParams();
  const editing =Boolean(id);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] =useState(editing);
  const [error, setError] =useState("");

useEffect(() => {
  if (!editing) return;
  let cancelled = false;
  getPost(id)
  .then((data) =>!cancelled && setPost(data))
  .catch((err) => !cancelled && setError(err.message))
  .finally(() =>!cancelled && setLoading(false));
  return () =>{
    cancelled = true;
  };
},[id, editing]);

async function handleSubmit(values) {
  const saved = editing ? await updatePost(id, values) :await createPost(values);
  navigate(`/posts/${saved.id}`);  
}

if(loading) return <p className="error">Loading...</p>;
if (error) return <p className="error">{error}<Link to= "/">Back to the blog</Link></p>;

return(
  <section>
    <h1>{editing ? "Edit post" : "Write a post"}</h1>
    <PostForm
    initial ={post}
    onSubmit ={handleSubmit}
    submitLabel={editing ? "save changes" : "Publish"}
    />
  </section>
);

}