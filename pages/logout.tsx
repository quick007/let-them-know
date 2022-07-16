import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { useRouter } from "next/router";

export default function Auth() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <>Loading</>;
  }

  if (!user) {
    router.push("/login");
  }

  if (user) {
    return (
      <>
        You are logged in.
        <button
          onClick={() => {
            supabaseClient.auth.signOut();
          }}
        >
          {" "}
          Logout
        </button>
      </>
    );
  }
}
