import { useState } from "react";
import { ApiError } from "../api.js";

export default function PostForm({ initial, onSubmit, submitLabel}){
  const [title, setTitle] =useState(initial?.title ?? "");
  const [author, setAuthor]=useState(initial?.author ?? "");
  const [content, setContent] =useState(initial?.content ?? "");
  const [saving, setSaving] = usestate(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error,setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFielsErrors({});
    try{
      await onSubmit({title, author, content});
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.fieldErrors);
      setError(err.message);
      setSaving(false);
    }    
  }

  return(
    <form className="post-form" onSubmit={handleSubmit} >
      <label>
        Title 
        {/* A "controlled input": its value always mirrors our state*/}
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength ={120}/>
        {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
      </label>

      <label>
        Author
        <input value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={60}/>
        {fieldErrors.author && <span className="field-error">{fieldErrors.author}</span>}
      </label>

      <label>
        content
        <textarea rows={12} value={content} onChange={(e) => setContent(e.target.value)}/>
          <span className="hint">Leave a blank line between paragraphs.</span>
          {fieldErrors.content && <span className="field-error">{fieldErrors.content}</span>}
      </label>
      {error && Object.keys(fieldErrors).length === 0 && <p className="error">{error}</p>}
    </form>
  );
}