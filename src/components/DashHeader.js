import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faRightFromBracket,
   faFilePen,
   faUserGear,
   faUserPlus,
   faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
   const { isManager, isAdmin } = useAuth();
   const navigate = useNavigate();
   const { pathname } = useLocation();

   const [sendLogout, { isLoading, isError, error }] = useSendLogoutMutation();

   const onLogoutClicked = async () => {
      await sendLogout();
      navigate("/");
   };

   const onUsersClicked = () => navigate("/dash/users");
   const onNotesClicked = () => navigate("/dash/notes");
   const onNewNoteClicked = () => navigate("/dash/notes/new");
   const onNewUserClicked = () => navigate("/dash/users/new");

   let dashClass = null;
   if (
      !DASH_REGEX.test(pathname) &&
      !NOTES_REGEX.test(pathname) &&
      !USERS_REGEX.test(pathname)
   ) {
      dashClass = "dash-header__container--small";
   }

   let notesButton = null;
   if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
      notesButton = (
         <button className="icon-button" title="Notes" onClick={onNotesClicked}>
            <FontAwesomeIcon icon={faFilePen} />
         </button>
      );
   }
   let newNoteButton = null;
   if (NOTES_REGEX.test(pathname)) {
      newNoteButton = (
         <button
            className="icon-button"
            title="New Note"
            onClick={onNewNoteClicked}
         >
            <FontAwesomeIcon icon={faFileCirclePlus} />
         </button>
      );
   }

   let newUserButton = null;
   if (USERS_REGEX.test(pathname)) {
      newUserButton = (
         <button
            className="icon-button"
            title="New User"
            onClick={onNewUserClicked}
         >
            <FontAwesomeIcon icon={faUserPlus} />
         </button>
      );
   }
   let usersButton = null;
   if (isManager || isAdmin) {
      if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
         usersButton = (
            <button
               className="icon-button"
               title="Users"
               onClick={onUsersClicked}
            >
               <FontAwesomeIcon icon={faUserGear} />
            </button>
         );
      }
   }
   const logoutButton = (
      <button
         className="icon-button"
         onClick={onLogoutClicked}
         title="Logout"
         aria-label="Logout"
      >
         <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>
      </button>
   );

   const errClass = isError ? "errmsg" : "offscreen";

   return (
      <>
         <p className={errClass}>{error?.data.message}</p>

         <header className="dash-header">
            <div className={`dash-header__container ${dashClass}`}>
               <Link to="/dash">
                  <h1 className="dash-header__title">techNotes</h1>
               </Link>
               <nav className="dash-header__nav">
                  {isLoading ? (
                     <p>Logging Out...</p>
                  ) : (
                     <>
                        {notesButton}
                        {newNoteButton}
                        {usersButton}
                        {newUserButton}
                        {logoutButton}
                     </>
                  )}
               </nav>
            </div>
         </header>
      </>
   );
};
export default DashHeader;
