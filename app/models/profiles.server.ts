// ./app/models/profiles.server.ts

// import types
import slugify from "~/utils/slugify"
import { ErrorResponse, LoginActionData, LoginResponse, Profile, ProfileData, RegisterActionData } from "~/utils/types"

// Strapi API URL from environment varaibles
const strapiApiUrl = process.env.STRAPI_API_URL

// helper function to throw errors is any
// const catchError = (res: any) => { if (res.error) throw Error(JSON.stringify(res.error)) }

// function to fetch all profiles
export const getProfiles = async (): Promise<Array<Profile>> => {
  const profiles = await fetch(`${strapiApiUrl}/users/?populate=profilePic`)
  let response = await profiles.json()
  // catchError(response)
  return response
}

// function to get a single profile by it's slug
export const getProfileBySlug = async (slug: string | undefined): Promise<Profile> => {
  const profile = await fetch(`${strapiApiUrl}/users?populate=profilePic&filters[slug]=${slug}`)
  let response = await profile.json()
  console.log({ response });
  // catchError(response)

  // since the request is filter, it returns an array
  // here we return the first itm in the array
  // since the slug is unique, it'll only return one item
  return response[0]
}

// function to sign in
export const signIn = async (data: LoginActionData): Promise<LoginResponse> => {
  console.log({ data });

  // make POST request to Strapi Auth URL
  const profile = await fetch(`${strapiApiUrl}/auth/local`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  let response = await profile.json()

  console.log({ response });

  // return login response
  return response
}

// function to register user
export const register = async (data: RegisterActionData): Promise<LoginResponse> => {
  // generate slug from username
  let slug = slugify(data.username?.toString())
  data.slug = slug


  // make POST request to Strapi Register Auth URL
  const profile = await fetch(`${strapiApiUrl}/auth/local/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  // console.log({ profile });

  // get response from request
  let response = await profile.json()

  // console.log({ response });

  // return register response
  return response
}

// function to update a profile
export const updateProfile = async (data: ProfileData, token: string | undefined): Promise<Profile & ErrorResponse> => {
  // get id from data
  const { id } = data

  // PUT request to update data
  const profile = await fetch(`${strapiApiUrl}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // set the auth token to the user's jwt
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data)
  })

  let response = await profile.json()

  console.log({ response });

  return response
}

// function to send forgot password email
export const sendResetMail = async (email: string | File | null | undefined) => {
  // console.log({ email, token });

  const response = await (await fetch(`${strapiApiUrl}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify({ email })
  })).json()

  // console.log({ response });

  return response
}

export const resetPass = async ({ password, passwordConfirmation, code }: { password: File | string | null | undefined, passwordConfirmation: File | string | null | undefined, code: File | string | null | undefined }) => {
  console.log({ password, passwordConfirmation, code });

  const response = await (await fetch(`${strapiApiUrl}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      passwordConfirmation,
      code
    })
  })).json()

  console.log({ response });

  return response
}
