import "@/app/globals.css";
import GoogleMapLoader from "@/components/GoogleMapLoader";
import { AppProps } from "next/app";
import { AuthProvider } from "@/providers/AuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import * as Tooltip from "@radix-ui/react-tooltip";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <Tooltip.Provider delayDuration={0}>

      <LanguageProvider>
        <AuthProvider>

          <GoogleMapLoader>
            <Component {...pageProps} />
          </GoogleMapLoader>

        </AuthProvider>
      </LanguageProvider>
    </Tooltip.Provider>

  );
}
