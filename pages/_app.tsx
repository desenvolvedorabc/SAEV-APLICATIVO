import "bootstrap/dist/css/bootstrap.css";
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import { AppProps } from "next/app";
import { useState, useEffect } from "react";
import LoadingScreen from "src/components/loadingPage";
import { useRouter } from "next/router";
import { ToastContainer } from 'react-toastify';

import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { BreadcrumbProvider } from "../src/context/breadcrumb.context";

import "../styles/globals.css";
import { AuthProvider } from "src/context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "src/lib/react-query";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      window.scrollTo(0, 0);
      setLoading(true);
    };
    const handleStop = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
        router.events.off("routeChangeStart", handleStart);
        router.events.off("routeChangeComplete", handleStop);
        router.events.off("routeChangeError", handleStop);
      }
    
  }, [router.events]);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    < QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Head>
          <link rel="shortcut icon" href="/assets/images/Icone_Navegador_SAEV2.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        {getLayout(
          <>
            {!loading ? (
              <BreadcrumbProvider>
                <Component {...pageProps} />
              </BreadcrumbProvider>
            ) : (
               <LoadingScreen />
             )}
          </>
        )}
      </AuthProvider>
        <ToastContainer />
      </QueryClientProvider>
  );
}

export default MyApp;
