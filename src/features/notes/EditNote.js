import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetNotesQuery } from "./notesApiSlice";
import useAuth from "../../hooks/useAuth";
import { PulseLoader } from "react-spinners";

const EditNote = () => {
   const { id } = useParams();
   const { username, isManager, isAdmin } = useAuth();

   const { note } = useGetNotesQuery(undefined, {
      selectFromResult: ({ data }) => ({
         note: data?.entities[id],
      }),
   });

   const { users } = useGetUsersQuery(undefined, {
      selectFromResult: ({ data }) => ({
         users: data?.ids.map((id) => data?.entities[id]),
      }),
   });

   if (!users?.length || !note) return <PulseLoader color={"#fff"} />;

   if (!isManager || !isAdmin) {
      if (note.username !== username) {
         return <p className="errmsg">No access</p>;
      }
   }

   return <EditNoteForm users={users} note={note} />;
};
export default EditNote;
