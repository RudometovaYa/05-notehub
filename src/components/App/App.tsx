import css from "./App.module.css";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import { fetchNotes } from "../../services/noteService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [debouncedQuery] = useDebounce<string>(query, 500);
  const safeQuery = debouncedQuery.trim();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", safeQuery, currentPage],
    queryFn: () => fetchNotes(safeQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const pageCount = data?.totalPages ?? 0;
  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
          {pageCount > 1 && (
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage - 1}
              onPageChange={(page) => setCurrentPage(page + 1)}
            />
          )}
          <SearchBox onSearch={handleSearch} />
        </header>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

        {data && data.notes.length === 0 && <p>Нотатки не знайдено.</p>}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onCancel={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
