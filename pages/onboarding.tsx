import { useUser } from "@supabase/supabase-auth-helpers/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProfile } from "../lib/profile";
import { ProfileResponse } from "../typings/profile";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { supabase } from "../lib/init";

export default function Onboarding() {
  const { user, isLoading } = useUser();
  const [profile, setProfile] = useState<null | ProfileResponse>(null);
  const router = useRouter();

  useEffect(() => {
    (async function prof() {
      if (user) {
        const profile = await getProfile(user);
        setProfile(profile);
      }
    })();
  }, [user]);

  async function updateProfile(username: string, website: string) {
    try {
      const updates = {
        id: user.id,
        username,
        website,
        updated_at: new Date(),
        cardsID: 0,
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
    } finally {
    }
  }

  if (isLoading || profile == null) {
    return <>loading</>;
  }

  if (!user) router.push("/login");
  if (profile.success) router.push("/dashboard");

  if (user && !profile.success)
    return (
      <>
        <h1 className="text-3xl font-bold">Onboarding</h1>
        <Formik
          initialValues={{ username: "", website: "" }}
          onSubmit={(data) => updateProfile(data.username, data.website)}
          validationSchema={Yup.object({
            username: Yup.string()
              .max(15, "Usernames must be less than 16 charachters")
              .required("This field is required"),
            website: Yup.string()
              .max(15, "Usernames must be less than 16 charachters")
              .required("This field is required"),
          })}
        >
          <Form>
            <Field
              type="text"
              className="max-w-2xl rounded-lg"
              name="username"
            ></Field>
            <ErrorMessage name="username"></ErrorMessage>
            <Field
              type="text"
              className="max-w-2xl rounded-lg"
              name="website"
            ></Field>
            <ErrorMessage name="username"></ErrorMessage>
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      </>
    );
}
