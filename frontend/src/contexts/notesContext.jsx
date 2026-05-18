import { useState, useEffect, createContext, useContext } from "react";
import {
  getAllNotesApi,
  getANoteApi,
  updateNoteApi,
} from "../services/noteService.js";
import { createNoteApi, deleteNoteApi } from "../services/noteService.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const NotesContext = createContext();

export const ContextProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const data = await getAllNotesApi();
        console.log(data);
        setNotes(data || []);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.status === 429) {
          setIsRateLimited(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  async function getANote(id) {
    try {
      const data = await getANoteApi(id);
      return data;
    } catch (error) {
      setLoading(false);
    }
  }

  async function deleteNote(id) {
    try {
      await deleteNoteApi(id);
      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
      setLoading(false);
      toast.success("Note deleted successfully");
    } catch (error) {
      setLoading(false);
    }
  }

  async function createNote(note) {
    try {
      const data = await createNoteApi(note.title, note.content);
      setNotes([...notes, data]);
      setLoading(false);
      toast.success("Note created successfully");
      navigate("/");
    } catch (error) {
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
      setLoading(false);
    }
  }

  async function updateNote(id, updatedNote) {
    try {
      // const updatedNotes = notes.map((note) => {
      //   note._id === id ? [...note, updatedNote] : note;
      // });
      const data = await updateNoteApi(
        id,
        updatedNote.title,
        updatedNote.content,
      );
      setNotes(() => notes.map((note) => (note._id === id ? data : note)));
      setLoading(false);
      toast.success("Note updated successfully");
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        isRateLimited,
        getANote,
        deleteNote,
        createNote,
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNote = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNote must be used within a ContextProvider");
  }
  return context;
};
