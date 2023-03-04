import { useRouter } from "next/router";
import { useEffect } from "react";
import useAuth from "../lib/hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  const { pathname } = useRouter();

  return (
    auth?.user ? <d /> : 
  )
}

export default RequireAuth;

export function AuthGuard({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    //auth is initialized and there is no user
    if (!user) {
      // remember the page that user tried to access
      router.push("/login")
    }
  }, [router, user])

  // if auth initialized with a valid user show protected page
  if (user) {
    return <>{children}</>
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null
}