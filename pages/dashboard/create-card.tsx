import { useUser } from "@supabase/supabase-auth-helpers/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../components/layout";
import { newCard } from "../../lib/profile";
import { Card } from "../../typings/cards";
import * as Yup from "yup"


export default function Cards() {
  const router = useRouter();
	const {user, isLoading} = useUser();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const { starter } = router.query;
  if (!router.query) {
    return null;
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-screen-xl flex-col">
				<div className="s"><One /></div>
			</div>
    </Layout>
  );

  function One() {
		return (
			<Formik 
			initialValues={{ name: "", design: "" }} 
			onSubmit={(data: Card) => newCard(user, {name: data.name, design: data.design})}
			validationSchema={Yup.object({
				name: Yup.string().required("This field is required"),
				design: Yup.string()
			})}
			>
				<Form className="flex flex-col">
					Name
					<Field name="name" type="text" className="max-w-sm rounded-lg" />
					<ErrorMessage name="name" />
					<label>
              <Field type="radio" name="design" value="wedding" checked={starter == "wedding"} />
              Wedding
            </label>
            <label>
              <Field type="radio" name="design" value="birthday" checked={starter == "birthday"} />
              Birthday
            </label>
						<button type="submit">submit</button>
				</Form>
			</Formik>
		)
  }
}
