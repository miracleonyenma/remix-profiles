import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { sendResetMail } from "~/models/profiles.server";


// action function to get form values and run reset mail function
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  const response = await sendResetMail(email);

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
