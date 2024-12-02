import { useSession } from "next-auth/react";

import { useUser } from "@/context/UserContext";
import Loading from "@/components/Loading";

export const RequireAuth = ({
  children
} : {
  children: React.ReactNode
}) => {
  const { data: session, status } = useSession();
  const { isJwtAvailable } = useUser();

  if (status === 'loading' || !isJwtAvailable) {
    return <Loading />;
  }

  if (session && status === 'authenticated' && isJwtAvailable) {
    return(
      <div
        className="
        min-h-screen bg-gray-50
        flex flex-col
        items-center rounded-xl
      ">{children}</div>
    );
  }
}
