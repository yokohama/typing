import { useSession, signIn } from "next-auth/react";

import Loading from "@/components/Loading";

export const RequireAuth = ({
  children
} : {
  children: React.ReactNode
}) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Loading />;
  }

  if (session && status === 'authenticated') {
    return(
      <div
        className="
        min-h-screen bg-gray-50
        flex flex-col
        items-center rounded-xl
      ">{children}</div>
    );
  } else {
    signIn("google");
    return null;
  }
}
