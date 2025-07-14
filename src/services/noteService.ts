import axios from "axios";
import type { Note } from "../types/note";

const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

interface FetchNotesProps {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
}

export const fetchNotes = async (
  search: string,
  page: number = 1,
  perPage: number = 12
): Promise<FetchNotesProps> => {
  const response = await axios.get<FetchNotesProps>(`/notes`, {
    params: {
      search,
      page,
      perPage,
    },
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  return response.data;
};

interface CreateNoteProps {
  title: string;
  content: string;
}

export const createNote = async (noteData: CreateNoteProps): Promise<Note> => {
  const response = await axios.post<Note>(`/notes`, noteData, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  return response.data;
};
