import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { PulseLoader } from "react-spinners";

const PersistLogin = () => {
   const [persist] = usePersist();
   const token = useSelector(selectCurrentToken);
   const effectRan = useRef(false);

   //const [trueSuccess, setTrueSuccess] = useState(false);

   const [refresh, { isLoading, isUninitialized, isSuccess, isError, error }] =
      useRefreshMutation();

   useEffect(() => {
      if (
         effectRan.current === true ||
         process.env.NODE_ENV !== "development"
      ) {
         const verifyRefreshToken = async () => {
            console.log("veryfying refresh token");
            try {
               await refresh();
               //setTrueSuccess(true);
            } catch (err) {
               console.error(err);
            }
         };
         if (!token && persist) verifyRefreshToken();
      }
      return () => (effectRan.current = true);
   }, []);

   let content;
   if (!persist) {
      console.log("no persist");
      content = <Outlet />;
   } else if (isLoading) {
      console.log("loading");
      content = <PulseLoader color={"#fff"} />;
   } else if (isError) {
      console.log(error);
      content = (
         <p className="errmsg">
            {error?.data?.message}
            <br />
            <Link to="/login">Please login again</Link>
         </p>
      );
   } else if (isSuccess) {
      console.log("success");
      content = <Outlet />;
   } else if (token && isUninitialized) {
      console.log("token and uninit");
      console.log(isUninitialized);
      content = <Outlet />;
   }
   return content;
};
export default PersistLogin;
