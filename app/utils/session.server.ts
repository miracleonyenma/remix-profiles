// ./app/utils/session.server.ts

import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { LoginResponse } from "./types";

// initialize createCookieSession
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "userSession",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  }
})

// fucntion to save user data to session
export const createUserSession = async (userData: LoginResponse, redirectTo: string) => {
  const session = await getSession()
  session.set("userData", userData);

  console.log({ session });

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  })
}

// get cookies from request
const getUserSession = (request: Request) => {
  return getSession(request.headers.get("Cookie"))
}

// function to get user data from session
export const getUserData = async (request: Request): Promise<LoginResponse | null> => {
  const session = await getUserSession(request)
  const userData = session.get("userData")

  console.log({ userData });

  if (!userData) return null
  return userData
}

// fucntion to redirect user to login if no user data found in session
export const requireUser = async (request: Request, redirectTo: string = new URL(request.url).pathname): Promise<LoginResponse | null> => {
  const userData = await getUserData(request)

  if (!userData) {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo]
    ])
    throw redirect(`/sign-in?${searchParams}`)
  }

  return userData
}

// function to remove user data from session, logging user out
export const logout = async (request: Request) => {
  const session = await getUserSession(request);

  return redirect("/sign-in", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  })
}
