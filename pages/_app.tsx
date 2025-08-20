import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Script from "next/script";
import GameProvider from "./context/GameContext";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error", err);
    }
  }, []);

  return (
    <GameProvider>
      {/* Load Adsense script once */}
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5928121941232633"
        crossOrigin="anonymous"
      />
      <Component {...pageProps} />
    </GameProvider>
  );
}
