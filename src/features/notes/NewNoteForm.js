import { useEffect, useState } from "react";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewNoteForm = ({ users }) => {
   const navigate = useNavigate();
   const [addNewNote, { isSuccess, isLoading, isError, error }] =
      useAddNewNoteMutation();

   const [title, setTitle] = useState("");
   const [text, setText] = useState("");
   const [user, setUser] = useState(users[0]?.id || "");

   const usersOptions = users.map((user) => (
      <option key={user.id} value={user.id}>
         {user.username}
      </option>
   ));

   const canSave = [title, text, user].every(Boolean) && !isLoading;

   const onTitleChanged = (e) => setTitle(e.target.value);
   const onTextChanged = (e) => setText(e.target.value);
   const onUserChanged = (e) => setUser(e.target.value);

   useEffect(() => {
      if (isSuccess) {
         setTitle("");
         setText("");
         setUser("");
         navigate("/dash/notes");
      }
   }, [isSuccess]);

   const onSaveNoteClicked = async (e) => {
      e.preventDefault();
      if (canSave) {
         await addNewNote({ title, text, user });
      }
   };

   const errClass = isError ? "errmsg" : "offscreen";
   const validTitleClass = title ? "" : "form__input--incomplete";
   const validTextClass = text ? "" : "form__input--incomplete";

   const content = (
      <>
         <p className={errClass}>{error?.data?.message}</p>

         <form className="form" onSubmit={onSaveNoteClicked}>
            <div className="form__title-row">
               <h2>New techNote</h2>
               <div className="form__action-buttons">
                  <button
                     className="icon-button"
                     title="Save"
                     disabled={!canSave}
                  >
                     <FontAwesomeIcon icon={faSave} />
                  </button>
               </div>
            </div>
            <label className="form__label" htmlFor="title">
               Title:
            </label>
            <input
               className={`form__input ${validTitleClass}`}
               id="title"
               name="title"
               type="text"
               value={title}
               onChange={onTitleChanged}
               autoComplete="off"
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
            <label className="form__label" htmlFor="user">
               Assigned user:
            </label>
            <select
               className={`form__select`}
               id="roles"
               name="roles"
               value={user}
               onChange={onUserChanged}
            >
               {usersOptions}
            </select>
         </form>
      </>
   );

   return content;
};
export default NewNoteForm;
