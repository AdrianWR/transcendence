import { MantineProvider } from '@mantine/core'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import Layout from "../components/layout"
import '../styles/globals.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout,
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <>
    <Layout>
      {page}
    </Layout></>
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
      <Component {...pageProps} />
    </MantineProvider>
  )
}

