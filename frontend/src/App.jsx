import { Link, Route, Routes} from "react-router-dom";
import logo from "./assets/logo.svg";
import HomePage from "./pages/HomePage.jsx";
import PostPage from "./pages/PostPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";




export default function App() {
  return (
    <div className="site">
      <header className="site-header">
        <Link to="/" className="brand"><img src={logo} alt="Oke Blog" /></Link>
        <Link to="/new" className="btn">Write a post</Link>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/*":id" is a placeholder; /posts/7 gives id = "7" */}
          <Route path="/posts/:id" element={<PostPage/>} />
          <Route path ="/new" element= {<EditorPage />}/>
          <Route path="/posts/:id/edit" element={<EditorPage />} />
          {/* "*" matches any address not listed above*/}
          <Route  
          path="*"
          element ={<p className="notice">Page not found. <Link to="/">Back to the blog</Link></p>}

          />
        </Routes>          
      </main>
      <footer className="site-footer">Built By Alexander William Oke. React & Flask</footer>
    </div>
  );
}