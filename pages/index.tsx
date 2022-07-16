import { useUser } from "@supabase/supabase-auth-helpers/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile } from "../lib/profile";
import { ProfileResponse } from "../typings/profile";
import Layout from "../components/layout";

export default function Profile() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  if (isLoading) {
    return (
      <Layout>
        <>Loading</>
      </Layout>
    );
  }
  if (user) {
    const [profile, setProfile] = useState<null | ProfileResponse>(null);
    useEffect(() => {
      (async function prof() {
        const profile = await getProfile(user);
        console.log(profile, "profile");
        setProfile(profile);
      })();
    }, [user]);

    if (profile == null) {
      return (
        <Layout>
          <>loading profile</>
        </Layout>
      );
    }
    if (profile.success == false) {
      router.push("/onboarding");
    } else {
      return (
        <Layout nav="sticky">
          account made
          <div className="mb-[200rem]"></div>
        </Layout>
      );
    }
  }
  return (
    <>
      <Layout>
        not logged in
        <Link href="/login">
          <a>Login</a>
        </Link>
      </Layout>
    </>
  );
}
