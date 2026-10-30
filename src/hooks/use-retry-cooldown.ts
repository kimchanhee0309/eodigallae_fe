"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/lib/api-client";

export function useRetryCooldown() {
  const deadlineRef = useRef(0);

  const [deadline, setDeadline] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const startCooldown = useCallback((error: unknown) => {
    if (
      !(error instanceof ApiError) ||
      (error.status !== 429 && error.status !== 503) ||
      error.retryAt === null ||
      !Number.isFinite(error.retryAt)
    ) {
      return;
    }

    const now = Date.now();

    const nextDeadline = Math.max(deadlineRef.current, error.retryAt);

    if (nextDeadline <= now) {
      return;
    }

    deadlineRef.current = nextDeadline;

    setDeadline(nextDeadline);
    setRemainingSeconds(Math.ceil((nextDeadline - now) / 1_000));
  }, []);

  useEffect(() => {
    if (deadline === 0) {
      return;
    }

    function updateRemaining() {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1_000));

      setRemainingSeconds(seconds);

      if (seconds === 0) {
        window.clearInterval(timer);
      }
    }

    const timer = window.setInterval(updateRemaining, 250);

    window.addEventListener("focus", updateRemaining);
    document.addEventListener("visibilitychange", updateRemaining);

    return () => {
      window.clearInterval(timer);

      window.removeEventListener("focus", updateRemaining);
      document.removeEventListener("visibilitychange", updateRemaining);
    };
  }, [deadline]);

  const canSubmit = useCallback(() => {
    return Date.now() >= deadlineRef.current;
  }, []);

  return {
    remainingSeconds,
    isCoolingDown: remainingSeconds > 0,
    startCooldown,
    canSubmit,
  };
}
