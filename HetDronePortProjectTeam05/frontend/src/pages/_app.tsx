import '@/app/globals.css'
import GoogleMapLoader from "@/components/GoogleMapLoader";
import { AppProps } from "next/app";
import {AuthProvider} from "@/providers/AuthProvider";


export default function App({ Component, pageProps }: AppProps) {
  return (
      <AuthProvider>
        <GoogleMapLoader>
            <Component {...pageProps} />
        </GoogleMapLoader>
      </AuthProvider>
  )
}