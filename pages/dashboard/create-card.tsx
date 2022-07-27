import { useUser } from "@supabase/supabase-auth-helpers/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { getCards, newCard } from "../../lib/cards";
import { Card } from "../../typings/cards";
import * as Yup from "yup";
import { CardsResponse } from "../../typings/cards";

export default function Cards() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [submitting, setSubmitting] = useState({
    failed: false,
    submitting: false,
  });
  const { starter, editID } = router.query;

  const [profile, setProfile] = useState<null | CardsResponse>(null);

  useEffect(() => {
    (async function prof() {
      const profile = await getCards(user);
      setProfile(profile);
    })();
  }, [user]);
  if (!router.query) {
    return null;
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-screen-xl flex-col">
        <div className="s">
          <One />
        </div>
      </div>
    </Layout>
  );

  function One() {
    return (
      <Formik
        //@ts-ignore-error
        initialValues={{ name: "", design: starter }}
        onSubmit={(data: Card) => {
          setSubmitting({ failed: false, submitting: true }),
            submitData({
              name: data.name,
              design: data.design,
              id: profile.data.cardsID + 1,
              public: false,
              updated: new Date(),
            });
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("This field is required"),
          design: Yup.string().required(),
        })}
      >
        <Form className="flex flex-col">
          Name
          <Field name="name" type="text" className="max-w-sm rounded-lg" />
          <ErrorMessage name="name" />
          <label>
            <Field type="radio" name="design" value="wedding" />
            Wedding
          </label>
          <label>
            <Field type="radio" name="design" value="birthday" />
            Birthday
          </label>
          <button type="submit" className="" disabled={submitting.submitting}>
            {submitting.failed
              ? "Failed"
              : submitting.submitting
              ? "Creating Card..."
              : "Create Your Card"}
          </button>
        </Form>
      </Formik>
    );
  }

  function submitData(data: Card) {
    const card = newCard(
      user,
      {
        name: data.name,
        design: data.design,
        id: data.id,
        public: data.public,
        updated: data.updated,
      },
      profile.data,
      profile.cards
    );
    if (!card) {
      setSubmitting({ failed: true, submitting: false });
    } else {
      setSubmitting({ failed: false, submitting: false });
      alert("created card");
    }
  }
}
