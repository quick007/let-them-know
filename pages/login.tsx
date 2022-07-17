import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useState } from "react";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { useRouter } from "next/router";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Layout from "../components/layout";

export default function Auth() {
  const [sent, setSent] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (!user || isLoading) {
    return (
<Layout>
  <Login />
</Layout>
    )
  }

  if (user) {
    router.push("/onboarding");
  }

  function Login() {
    return (
      <div className="flex flex-col items-center">
          <p className="mb-4">
            Sign in via magic link with your email below
          </p>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(data) => {
              supabaseClient.auth.signIn(
                {
                  email: data.email,
                },
                { redirectTo: (process.env.NODE_ENV == "development" ? "http://localhost:3000/onbording" : process.env.ONBOARDING_LINK) }
              ),
                setSent(true);
            }}
            validationSchema={Yup.object({
              email: Yup.string().email().required("This field is required"),
            })}
          
          >
            <Form className=" flex flex-col max-w-md">
              <Field type="email" name="email" placeholder="Your email" className="rounded-xl " />
              <ErrorMessage name="email" className="" />
              <button type="submit" disabled={sent || isLoading} className="rounded mt-2 px-4 py-1 disabled:bg-cyan-8w00 bg-cyan-600 disabled:text-gray-100 text-gray-50 font-medium ">
                {!sent ? "Send link" : "sent"}
              </button>
            </Form>
          </Formik>
      </div>
    );
  }
}
