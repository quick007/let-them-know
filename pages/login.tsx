import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { Fragment, useState } from "react";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { useRouter } from "next/router";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Layout from "../components/layout";
import { Dialog, Transition } from "@headlessui/react";

export default function Auth() {
  const [sent, setSent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (!user || isLoading) {
    return (
      <div className="relative">
        <Layout>
          <Login />
        </Layout>

        {/* <MyDialog /> */}
      </div>
    );
  }

  if (user) {
    router.push("/onboarding");
  }

  function Login() {
    return (
      <>
        <div className="flex flex-col items-center">
          <p className="mb-4">Sign in via magic link with your email below</p>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(data) => {
              supabaseClient.auth.signIn(
                {
                  email: data.email,
                },
                {
                  redirectTo:
                    process.env.NODE_ENV == "development"
                      ? "http://localhost:3000/onboarding"
                      : process.env.NEXT_PUBLIC_ONBOARDING_LINK,
                }
              ),
                setSent(true),
                setIsOpen(true);
            }}
            validationSchema={Yup.object({
              email: Yup.string().email().required("This field is required"),
            })}
          >
            <Form className=" flex max-w-md flex-col">
              <Field
                type="email"
                name="email"
                placeholder="Your email"
                className="rounded-xl py-1.5 disabled:bg-gray-300 disabled:opacity-50"
                disabled={sent}
              />
              <span className="text-sm text-red-400">
                <ErrorMessage name="email" />
              </span>
              <button
                type="submit"
                disabled={sent || isLoading}
                className="disabled:bg-cyan-8w00 mt-2 rounded bg-cyan-600 px-4 py-1 font-medium text-gray-50 disabled:text-gray-100 "
              >
                {!sent ? "Send link" : "Sent Link"}
              </button>
            </Form>
          </Formik>
        </div>
        <MyDialog />
      </>
    );
  }
  function MyDialog() {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    Email Sent
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please check your email for a magic link to log in. Make
                      sure to check your spam folder if its not in your inbox.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
}
