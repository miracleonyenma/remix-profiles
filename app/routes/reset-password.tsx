import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { resetPass, sendResetMail } from "~/models/profiles.server";
import { getUserData, requireUser } from "~/utils/session.server";

type LoaderData = {
  code: string | undefined;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) return redirect("/");

  return json<LoaderData>({
    code,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const code = formData.get("code");
  const password = formData.get("password");
  const passwordConfirmation = formData.get("confirmPassword");

  const response = await resetPass({ password, passwordConfirmation, code });

  console.log({ response });

  if (password != passwordConfirmation) return json({ confirmPassword: "Passwords should match" });
  // console.log({ response });
  return json(response);
};

const ResetPass = () => {
  const transition = useTransition();
  const error = useActionData();
  const { code } = useLoaderData() as LoaderData;

  return (
    <section className="site-section profiles-section">
      <div className="wrapper">
        <header className="section-header">
          <h2 className="text-4xl">Reset password</h2>
          <p>Enter your new password</p>
        </header>

        <Form method="post" className="form">
          <input value={code} type="hidden" id="code" name="code" required />
          <div className="wrapper">
            <div className="form-control">
              <label htmlFor="job-title">Password</label>
              <input id="password" name="password" type="password" className="form-input" required />
              {/* {errors?.password ? <em className="text-red-600">{errors.password}</em> : null} */}
            </div>
            <div className="form-control">
              <label htmlFor="job-title">Confirm password</label>
              <input id="confirmPassword" name="confirmPassword" type="confirmPassword" className="form-input" required />
              {error?.confirmPassword ? <em className="text-red-600">{error.confirmPassword}</em> : null}
            </div>
            <div className="action-cont mt-4">
              <button className="cta"> {transition.state == "submitting" ? "Sending" : "Reset password"} </button>
            </div>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default ResetPass;
