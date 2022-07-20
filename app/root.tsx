// ./app/root.jsx

import { MetaFunction, LinksFunction, json, LoaderFunction } from "@remix-run/node";

// import compiled styles
import styles from "./styles/app.css";

import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

// import site header component
import SiteHeader from "./components/SiteHeader";
import { getUserData } from "./utils/session.server";

type LoaderData = {
  userData: Awaited<ReturnType<typeof getUserData>>;
};

// add site meta
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Profiles | Find & connect with people",
  viewport: "width=device-width,initial-scale=1",
});

// add links to site head
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

// add environment variables to loader
export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    userData: await getUserData(request),
  });
};

export default function App() {
  const { userData } = useLoaderData() as LoaderData;

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="site-main">
          {/* place site header above app outlet */}
          <SiteHeader user={userData?.user} />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </main>
      </body>
    </html>
  );
}
