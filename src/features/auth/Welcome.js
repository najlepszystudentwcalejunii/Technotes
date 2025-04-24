import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
   const { username, isAdmin, isManager } = useAuth();
   const date = new Date();
   const today = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "long",
   }).format(date);
   const content = (
      <section className="welcome">
         <p>{today}</p>
         <h1>Welcome {username}!</h1>
         <p>
            <Link to="/dash/notes">View techNotes</Link>
         </p>
         <p>
            <Link to="/dash/notes/new">Add new techNote</Link>
         </p>
         <p>
            {(isManager || isAdmin) && (
               <Link to="/dash/users">View User Settings</Link>
            )}
         </p>

         <p>
            {(isManager || isAdmin) && (
               <Link to="/dash/users/new">Add new user</Link>
            )}
         </p>
      </section>
   );

   return content;
};
export default Welcome;
