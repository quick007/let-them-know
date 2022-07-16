import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useState } from "react";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { useRouter } from "next/router";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Auth() {
  const [sent, setSent] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (!user || isLoading) {
    return <Login />;
  }

  if (user) {
    router.push("/onboarding");
  }

  function Login() {
    return (
      <div className="row flex-center flex">
        <div className="col-6 form-widget">
          <p className="description">
            Sign in via magic link with your email below
          </p>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(data) => {
              supabaseClient.auth.signIn(
                {
                  email: data.email,
                },
                { redirectTo: "/onbording" }
              ),
                setSent(true);
            }}
            validationSchema={Yup.object({
              email: Yup.string().email().required("This field is required"),
            })}
          >
            <Form>
              <Field type="email" name="email" placeholder="Your email" />
              <ErrorMessage name="email" />
              <button type="submit" disabled={sent}>
                {!sent ? "Send link" : "sent"}
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}
