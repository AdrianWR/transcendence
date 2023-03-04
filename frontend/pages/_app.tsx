import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import Layout from "../components/layout"
import { AuthProvider } from '../lib/context/AuthContext'
import { useAuth } from '../lib/hooks/useAuth'
import '../styles/globals.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}


export default function MyApp({ Component, pageProps }: AppProps) {
  const { user, login, logout } = useAuth();

  // Use the layout defined at the page level, if available
  const getLayout = ((page) =>
    <>
      <Layout>
        {page}
      </Layout>
    </>
  )

  return getLayout(
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
      }}
    >
      <NotificationsProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </NotificationsProvider>
    </MantineProvider>
  )
}

