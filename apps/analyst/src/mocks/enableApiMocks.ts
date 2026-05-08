declare global {
  interface Window {
    __MSW_READY__?: Promise<void>;
  }
}

function shouldUseApiMocks() {
  return import.meta.env.NEXT_PUBLIC_USE_API_MOCKS === "true";
}

export function enableApiMocks() {
  if (!shouldUseApiMocks()) {
    console.warn("[MSW] (TMR) Skipping - NEXT_PUBLIC_USE_API_MOCKS is not 'true'");
    return Promise.resolve();
  }

  const ready = import("./browser")
    .then(({ worker }) => {
      console.warn("[MSW] (TMR) Starting browser worker...");
      return worker.start({
        onUnhandledRequest: "warn",
      });
    })
    .then(() => {
      console.warn("[MSW] (TMR) Worker started");
    })
    .catch((err: unknown) => {
      console.error("[MSW] (TMR) Failed to start:", err);
    });

  window.__MSW_READY__ = ready;
  return ready;
}
