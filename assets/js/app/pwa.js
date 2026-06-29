const SERVICE_WORKER_URL = "./sw.js";

export function registerProspectrePwa() {
  if (!("serviceWorker" in navigator)) return;

  const isLocalhost = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  if (window.location.protocol !== "https:" && !isLocalhost) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(SERVICE_WORKER_URL, { scope: "./" })
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent("prospectre:pwa-update", { detail: { registration } }));
            }
          });
        });
      })
      .catch((error) => {
        console.warn("[PROSPECTRE] Service worker registration failed", error);
      });
  });
}

registerProspectrePwa();
