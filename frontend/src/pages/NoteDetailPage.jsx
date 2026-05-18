import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import { useNote } from "../contexts/notesContext";
import { Link, useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import { getANoteApi } from "../services/noteService";

const NoteDetailPage = () => {
  const { loading, deleteNote, updateNote } = useNote();
  const [note, setNote] = useState({ title: "", content: "" });
  // const [title, setTitle] = useState();
  // const [content, setContent] = useState();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      const data = await getANoteApi(id);
      // setTitle(data.title);
      // setContent(data.content);
      setNote(data);
    };
    fetchNote();
  }, [id]);

  async function handleDeleteNote() {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    await deleteNote(id);
    navigate("/");
  }

  async function handleUpdateNote() {
    // if (!title || !content) return;
    if (!note.title || !note.content) return;
    await updateNote(id, { title: note.title, content: note.content });
    navigate("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button
              onClick={handleDeleteNote}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note.title || ""}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={note.content || ""}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                />
              </div>

              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={handleUpdateNote}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
