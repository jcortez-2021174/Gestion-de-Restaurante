import { useEffect, useRef } from "react";

export const useSmartPolling = (callback, intervalMs, { immediate = true } = {}) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let disposed = false;
    let running = false;
    let timerId;

    const schedule = () => {
      if (!disposed) timerId = window.setTimeout(run, intervalMs);
    };

    const run = async () => {
      if (disposed || running || document.visibilityState === "hidden") {
        schedule();
        return;
      }
      running = true;
      try {
        await callbackRef.current();
      } finally {
        running = false;
        schedule();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && !running) {
        window.clearTimeout(timerId);
        run();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    if (immediate) run();
    else schedule();

    return () => {
      disposed = true;
      window.clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [intervalMs, immediate]);
};
