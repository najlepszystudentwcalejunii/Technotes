import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";

const Login = () => {
   const userRef = useRef();
   const errRef = useRef();

   const navigate = useNavigate();
   const dispatch = useDispatch();

   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [errMsg, setErrMsg] = useState("");
   const [persist, setPersist] = usePersist();

   const [login, { isLoading }] = useLoginMutation();
   const errClass = errMsg ? "errmsg" : "offscreen";

   const onUsernameChange = (e) => setUsername(e.target.value);
   const onPasswordChange = (e) => setPassword(e.target.value);
   const handleToggle = () => setPersist((prev) => !prev);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { accessToken } = await login({ username, password }).unwrap();
         dispatch(setCredentials({ accessToken }));
         setUsername("");
         setPassword("");
         navigate("/dash");
      } catch (err) {
         console.log(err);
         if (!err.data) {
            setErrMsg("No server response");
         } else if (err.status === 400) {
            setErrMsg("Missing username or password");
         } else if (err.status === 401) {
            setErrMsg("Unauthorized");
         } else {
            setErrMsg(err.data?.message);
         }
         if (!errRef) errRef.current.focus();
      }
   };

   useEffect(() => {
      userRef.current.focus();
   }, []);

   useEffect(() => {
      setErrMsg("");
   }, [username, password]);
   if (isLoading) return <p>Loading...</p>;

   const content = (
      <section className="public">
         <header>
            <h1>Employee Login</h1>
         </header>

         <main className="login">
            <p ref={errRef} className={errClass} aria-live="assertive">
               {errMsg}
            </p>

            <form className="form" onSubmit={handleSubmit}>
               <label className="form__label" htmlFor="username">
                  Username:
               </label>
               <input
                  className="form__input"
                  id="username"
                  type="text"
                  ref={userRef}
                  value={username}
                  onChange={onUsernameChange}
                  autoComplete="off"
               />
               <label className="form__label" htmlFor="password">
                  Password:
               </label>
               <input
                  className="form__input"
                  type="password"
                  id="password"
                  value={password}
                  onChange={onPasswordChange}
               />
               <button className="form__submit-button">Sign In</button>
               <label className="form__persist" htmlFor="persist">
                  <input
                     type="checkbox"
                     className="form__checkbox"
                     id="persist"
                     onChange={handleToggle}
                     checked={persist}
                  />
                  Trust this device
               </label>
            </form>
         </main>
         <footer>
            <Link to="/">Back to home</Link>
         </footer>
      </section>
   );
   return content;
};
export default Login;
