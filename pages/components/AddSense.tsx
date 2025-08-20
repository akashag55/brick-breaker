"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdsenseProps {
  slot: string;
  format?: string;
  className?: string;
}

export default function Adsense({
  slot,
  format = "auto",
  className,
}: AdsenseProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense load error", err);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-xxxxxxxxxx"
      data-ad-slot={slot}
      data-ad-format={format}
    ></ins>
  );
}
