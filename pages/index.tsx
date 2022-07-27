import { useUser } from "@supabase/supabase-auth-helpers/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile } from "../lib/profile";
import { ProfileResponse } from "../typings/profile";
import Layout from "../components/layout";
import Button from "../components/button";
import Tooltip from "../components/tooltip";

export default function Profile() {
  const { user, error, isLoading } = useUser();
  const [profile, setProfile] = useState<null | ProfileResponse>(null);
  const router = useRouter();
  useEffect(() => {
    (async function prof() {
      if (user) {
        const profile = await getProfile(user);
        console.log(profile, "profile");
        setProfile(profile);
      }
    })();
  }, [user]);
  if (isLoading) {
    return (
      <Layout>
        <>Loading</>
      </Layout>
    );
  }
  if (user) {
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
          <div className="mt-8 ml-8 flex items-center space-x-10">
            <Button color="cyan" use="primary">
              Main{" "}
            </Button>
            <Tooltip text="Click me">
              <Button color="cyan" use="secondary">
                2nd{" "}
              </Button>
            </Tooltip>
            <Button color="cyan" use="tertiary">
              3rd
              <Tooltip text="Also click me" />
            </Button>
          </div>
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
