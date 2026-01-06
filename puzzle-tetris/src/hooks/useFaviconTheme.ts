import { useEffect } from "react";

export default function useFaviconTheme() {
  useEffect(() => {
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const updateFavicon = () => {
      favicon!.href = media.matches
        ? `/android-chrome-192x192.png?v=${Date.now()}`
        : `/android-chrome-dark-192x192.png?v=${Date.now()}`;
    };

    updateFavicon();
    media.addEventListener("change", updateFavicon);

    return () => media.removeEventListener("change", updateFavicon);
  }, []);
}
