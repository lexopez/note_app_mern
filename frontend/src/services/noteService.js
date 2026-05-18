import api from "../lib/axios";

export const getAllNotesApi = async () => {
  try {
    const res = await api.get("/notes");
    return res.data;
  } catch (error) {
    console.error("Error getting notes", error);
    throw error;
  }
};

export const getANoteApi = async (id) => {
  try {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting note", error);
    throw error;
  }
};

export const createNoteApi = async (title, content) => {
  try {
    const res = await api.post("/notes", { title, content });
    return res.data;
  } catch (error) {
    console.error("Error creating note", error);
    throw error;
  }
};

export const updateNoteApi = async (id, title, content) => {
  try {
    const res = await api.put(`/notes/${id}`, { title, content });
    return res.data;
  } catch (error) {
    console.error("Error updating note", error);
    throw error;
  }
};

export const deleteNoteApi = async (id) => {
  try {
    await api.delete(`/notes/${id}`);
  } catch (error) {
    console.error("Error deleting note", error);
    throw error;
  }
};
