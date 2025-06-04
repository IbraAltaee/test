// src/pages/_app.tsx
import '@/app/globals.css'
import GoogleMapLoader from "@/components/GoogleMapLoader";
import { AppProps } from "next/app";
import { AuthProvider } from "@/providers/AuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <GoogleMapLoader>
          <Component {...pageProps} />
        </GoogleMapLoader>
      </AuthProvider>
    </LanguageProvider>
  )
}