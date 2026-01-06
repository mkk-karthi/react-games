import { useEffect } from "react";

export default function useFaviconTheme() {
  useEffect(() => {
    let favicon = document.querySelector("link[rel='icon']");

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const update = () => {
      favicon.href = media.matches
        ? `${process.env.PUBLIC_URL}/android-chrome-192x192.png?v=${Date.now()}`
        : `${process.env.PUBLIC_URL}/android-chrome-dark-192x192.png?v=${Date.now()}`;
    };

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);
}
