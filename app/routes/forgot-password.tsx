import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { sendResetMail } from "~/models/profiles.server";
import { getUserData, requireUser } from "~/utils/session.server";

// type LoaderData = {
//   userData: Awaited<ReturnType<typeof getUserData>>;
// };

// export const loader: LoaderFunction = async ({ request }) => {
//   return json<LoaderData>({
//     userData: await requireUser(request),
//   });
// };

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  // const userData = await requireUser(request);
  const response = await sendResetMail(email);
  // console.log({ response });
  return json(response);
};

const ForgotPass = () => {
  const transition = useTransition();
  const data = useActionData();

  return (
    <section className="site-section profiles-section">
      <div className="wrapper">
        <header className="section-header">
          <h2 className="text-4xl">Forgot password</h2>
          <p>Click the button below to send the reset link to your registerd email</p>
        </header>

        <Form method="post" className="form">
          <div className="wrapper">
            <p>{data?.ok ? "Link sent! Check your mail. Can't find it in the inbox? Check Spam" : ""}</p>
            <div className="form-control">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="form-input" required />
              {/* {errors?.password ? <em className="text-red-600">{errors.password}</em> : null} */}
            </div>
            <div className="action-cont mt-4">
              <button className="cta"> {transition.state == "submitting" ? "Sending" : "Send link"} </button>
            </div>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default ForgotPass;
