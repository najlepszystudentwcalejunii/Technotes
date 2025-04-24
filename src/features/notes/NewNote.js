import NewNoteForm from "./NewNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { PulseLoader } from "react-spinners";

const NewNote = () => {
   const { users } = useGetUsersQuery(undefined, {
      selectFromResult: ({ data }) => ({
         users: data?.ids.map((id) => data?.entities[id]),
      }),
   });

   if (!users.length) return <PulseLoader color={"#fff"} />;
   return <NewNoteForm users={users} />;
};
export default NewNote;
