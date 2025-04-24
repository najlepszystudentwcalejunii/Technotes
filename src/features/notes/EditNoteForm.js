import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditNoteForm = ({ users, note }) => {
   const { isManager, isAdmin } = useAuth();
   const [updateNote, { isLoading, isSuccess, isError, error }] =
      useUpdateNoteMutation();
   const [
      deleteNote,
      { isSuccess: isDelSuccess, isError: isDelError, error: delError },
   ] = useDeleteNoteMutation();

   const navigate = useNavigate();

   const [title, setTitle] = useState(note.title);
   const [text, setText] = useState(note.text);
   const [status, setStatus] = useState(note.completed);
   const [user, setUser] = useState(note.user);

   const dateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
   };

   const created = new Date(note.createdAt).toLocaleString(
      "en-Us",
      dateOptions
   );
   const updated = new Date(note.updatedAt).toLocaleString(
      "en-Us",
      dateOptions
   );

   useEffect(() => {
      if (isSuccess || isDelSuccess) {
         navigate("/dash/notes");
      }
   }, [isSuccess, isDelSuccess, navigate]);

   const onStatusChanged = (e) => setStatus((prev) => !prev);
   const onTitleChanged = (e) => setTitle(e.target.value);
   const onTextChanged = (e) => setText(e.target.value);
   const onUserChanged = (e) => setUser(e.target.value);

   const onSaveNoteClicked = async (e) => {
      await updateNote({ id: note.id, title, text, completed: status, user });
   };
   const onDeleteNoteClicked = async (e) => {
      await deleteNote({ id: note.id });
   };

   const userOptions = users.map((user) => (
      <option key={user.id} value={user.id}>
         {user.username}
      </option>
   ));

   const canSave = [title, text].every(Boolean) && !isLoading;

   const errClass = isError || isDelError ? "errmsg" : "offscreen";
   const validTitledClass = title ? "" : "form__input--incomplete";
   const validTextClass = text ? "" : "form__input--incomplete";
   const errContent = (error?.data?.message || delError?.data?.message) ?? "";
   let deleteButton = null;
   if (isManager || isAdmin) {
      deleteButton = (
         <button
            className="icon-button"
            title="Delete"
            onClick={onDeleteNoteClicked}
         >
            <FontAwesomeIcon icon={faTrashCan} />
         </button>
      );
   }

   const content = (
      <>
         <p className={errClass}>{errContent}</p>

         <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="form__title-row">
               <h2>Edit Note {note.ticket}#</h2>
               <div className="form__action-buttons">
                  <button
                     className="icon-button"
                     title="Save"
                     onClick={onSaveNoteClicked}
                     disabled={!canSave}
                  >
                     <FontAwesomeIcon icon={faSave} />
                  </button>
                  {deleteButton}
               </div>
            </div>
            <label className="form__label" htmlFor="title">
               Title:
            </label>
            <input
               className={`form__input ${validTitledClass}`}
               id="title"
               name="title"
               type="text"
               autoComplete="off"
               value={title}
               onChange={onTitleChanged}
            />
            <label className="form__label" htmlFor="text">
               Text:
            </label>
            <textarea
               className={`form__input ${validTextClass}`}
               id="text"
               rows={4}
               name="text"
               value={text}
               onChange={onTextChanged}
               maxLength={200}
            />
            <div className="form__note-info">
               <label
                  className="form__label form__checkbox-container"
                  htmlFor="note-status"
               >
                  Work Complete:
                  <input
                     className="form__checkbox"
                     id="note-status"
                     name="note-status"
                     type="checkbox"
                     checked={status}
                     onChange={onStatusChanged}
                  />
               </label>
               <p>
                  Created: <br />
                  {created}
               </p>
               <label className="form__label" htmlFor="user">
                  Assigned User:{"   "}
                  <select
                     className={`form__select`}
                     id="user"
                     name="user"
                     value={user}
                     onChange={onUserChanged}
                  >
                     {userOptions}
                  </select>
               </label>
               <p>
                  Updated:
                  <br />
                  {updated}
               </p>
            </div>
         </form>
      </>
   );

   return content;
};
export default EditNoteForm;
