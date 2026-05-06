"use client";

import { useEffect } from "react";

const submitIcon =
  '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M22 2 11 13"></path><path d="m22 2-7 20-4-9-9-4 20-7Z"></path></svg></span>';

function getTomorrowSameTimeValue() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setSeconds(0, 0);
  return formatDatetimeLocalValue(tomorrow);
}

function getNowValue() {
  const now = new Date();
  now.setSeconds(0, 0);
  return formatDatetimeLocalValue(now);
}

function formatDatetimeLocalValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function PetCareInteractions() {
  useEffect(() => {
    const form = document.getElementById("bookingForm") as HTMLFormElement | null;
    const note = document.getElementById("formNote");
    const arrivalInput = form?.querySelector<HTMLInputElement>("input[name=\"arrivalTime\"]");

    const setDefaultArrivalTime = () => {
      if (!arrivalInput) return;
      arrivalInput.value = getTomorrowSameTimeValue();
      arrivalInput.min = getNowValue();
      arrivalInput.step = "60";
    };

    setDefaultArrivalTime();

    const formQueryKeys = ["arrivalTime", "name", "phone", "pet", "service", "note"];
    const searchParams = new URLSearchParams(window.location.search);
    if (formQueryKeys.some((key) => searchParams.has(key))) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
    }
    const environmentTrack = document.querySelector<HTMLElement>(".environment-track");
    const environmentDots = Array.from(document.querySelectorAll<HTMLButtonElement>(".environment-dot"));
    const environmentPrev = document.querySelector<HTMLButtonElement>(".carousel-arrow.prev");
    const environmentNext = document.querySelector<HTMLButtonElement>(".carousel-arrow.next");
    const environmentCarousel = document.querySelector<HTMLElement>(".environment-carousel");
    const environmentSlides = Array.from(document.querySelectorAll<HTMLElement>(".environment-slide"));
    const environmentSlideCount = environmentSlides.length;
    const reviewCarousel = document.querySelector<HTMLElement>(".review-carousel");
    const reviewTrack = document.querySelector<HTMLElement>(".review-track");
    const reviewSlides = Array.from(document.querySelectorAll<HTMLElement>(".review-card"));
    const reviewDots = Array.from(document.querySelectorAll<HTMLButtonElement>(".review-dot"));
    const reviewPrev = document.querySelector<HTMLButtonElement>(".review-arrow.prev");
    const reviewNext = document.querySelector<HTMLButtonElement>(".review-arrow.next");
    const reviewSlideCount = reviewSlides.length;
    let environmentIndex = 0;
    let environmentPosition = environmentSlideCount > 1 ? 1 : 0;
    let reviewIndex = 0;
    let reviewPosition = reviewSlideCount > 1 ? 1 : 0;
    let isCarouselPaused = false;
    let isReviewCarouselPaused = false;
    let isEnvironmentAnimating = false;
    let isReviewAnimating = false;
    let intervalId: number | undefined;
    let reviewIntervalId: number | undefined;

    const firstSlideClone = environmentSlideCount > 1 ? environmentSlides[0].cloneNode(true) : null;
    const lastSlideClone =
      environmentSlideCount > 1 ? environmentSlides[environmentSlideCount - 1].cloneNode(true) : null;
    const firstReviewClone = reviewSlideCount > 1 ? reviewSlides[0].cloneNode(true) : null;
    const lastReviewClone = reviewSlideCount > 1 ? reviewSlides[reviewSlideCount - 1].cloneNode(true) : null;

    // Clone the ends so carousel wraparound keeps moving forward instead of visually rewinding.
    firstSlideClone instanceof HTMLElement && firstSlideClone.setAttribute("aria-hidden", "true");
    lastSlideClone instanceof HTMLElement && lastSlideClone.setAttribute("aria-hidden", "true");
    if (environmentTrack && firstSlideClone && lastSlideClone) {
      environmentTrack.prepend(lastSlideClone);
      environmentTrack.append(firstSlideClone);
    }
    firstReviewClone instanceof HTMLElement && firstReviewClone.setAttribute("aria-hidden", "true");
    lastReviewClone instanceof HTMLElement && lastReviewClone.setAttribute("aria-hidden", "true");
    if (reviewTrack && firstReviewClone && lastReviewClone) {
      reviewTrack.prepend(lastReviewClone);
      reviewTrack.append(firstReviewClone);
    }

    const setTrackTransition = (enabled: boolean) => {
      if (!environmentTrack) return;
      environmentTrack.style.transition = enabled ? "" : "none";
    };

    const setTrackPosition = (position: number) => {
      if (!environmentTrack) return;
      environmentTrack.style.transform = `translateX(-${position * 100}%)`;
    };

    const updateEnvironmentDots = () => {
      environmentDots.forEach((dot, dotIndex) => {
        dot.setAttribute("aria-current", String(dotIndex === environmentIndex));
      });
    };

    const syncEnvironmentIndex = () => {
      if (environmentSlideCount <= 0) return;
      environmentIndex =
        ((environmentPosition - 1) % environmentSlideCount + environmentSlideCount) % environmentSlideCount;
      updateEnvironmentDots();
    };

    const jumpToEnvironmentPosition = (position: number) => {
      setTrackTransition(false);
      environmentPosition = position;
      setTrackPosition(environmentPosition);
      syncEnvironmentIndex();
      environmentTrack?.offsetHeight;
      window.requestAnimationFrame(() => setTrackTransition(true));
    };

    const moveEnvironmentSlide = (position: number) => {
      if (!environmentTrack || environmentSlideCount <= 1 || isEnvironmentAnimating) return;
      isEnvironmentAnimating = true;
      setTrackTransition(true);
      environmentPosition = position;
      setTrackPosition(environmentPosition);
      syncEnvironmentIndex();
      startAutoPlay();
    };

    const stopAutoPlay = () => {
      if (intervalId) window.clearInterval(intervalId);
      intervalId = undefined;
    };

    const startAutoPlay = () => {
      if (environmentDots.length <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      stopAutoPlay();
      intervalId = window.setInterval(() => {
        if (!isCarouselPaused) moveEnvironmentSlide(environmentPosition + 1);
      }, 5200);
    };

    const transitionEndHandler = (event: TransitionEvent) => {
      if (event.target !== environmentTrack || event.propertyName !== "transform") return;
      isEnvironmentAnimating = false;
      if (environmentPosition === environmentSlideCount + 1) {
        jumpToEnvironmentPosition(1);
      } else if (environmentPosition === 0) {
        jumpToEnvironmentPosition(environmentSlideCount);
      }
    };
    environmentTrack?.addEventListener("transitionend", transitionEndHandler);

    if (environmentSlideCount > 1) {
      jumpToEnvironmentPosition(1);
    } else {
      updateEnvironmentDots();
    }

    const dotHandlers = environmentDots.map((dot, index) => {
      const handler = () => moveEnvironmentSlide(index + 1);
      dot.addEventListener("click", handler);
      return { dot, handler };
    });

    const previousHandler = () => moveEnvironmentSlide(environmentPosition - 1);
    const nextHandler = () => moveEnvironmentSlide(environmentPosition + 1);
    environmentPrev?.addEventListener("click", previousHandler);
    environmentNext?.addEventListener("click", nextHandler);

    const pauseCarousel = () => {
      isCarouselPaused = true;
    };
    const resumeCarousel = () => {
      isCarouselPaused = false;
    };
    environmentCarousel?.addEventListener("mouseenter", pauseCarousel);
    environmentCarousel?.addEventListener("mouseleave", resumeCarousel);
    environmentCarousel?.addEventListener("focusin", pauseCarousel);
    environmentCarousel?.addEventListener("focusout", resumeCarousel);
    startAutoPlay();

    const updateReviewDots = () => {
      reviewDots.forEach((dot, dotIndex) => {
        dot.setAttribute("aria-current", String(dotIndex === reviewIndex));
      });
    };

    const setReviewTrackTransition = (enabled: boolean) => {
      if (!reviewTrack) return;
      reviewTrack.style.transition = enabled ? "" : "none";
    };

    const setReviewTrackPosition = (position: number) => {
      if (!reviewTrack) return;
      reviewTrack.style.transform = `translateX(-${position * 100}%)`;
    };

    const syncReviewIndex = () => {
      if (reviewSlideCount <= 0) return;
      reviewIndex = ((reviewPosition - 1) % reviewSlideCount + reviewSlideCount) % reviewSlideCount;
      updateReviewDots();
    };

    const jumpToReviewPosition = (position: number) => {
      setReviewTrackTransition(false);
      reviewPosition = position;
      setReviewTrackPosition(reviewPosition);
      syncReviewIndex();
      reviewTrack?.offsetHeight;
      window.requestAnimationFrame(() => setReviewTrackTransition(true));
    };

    const stopReviewAutoPlay = () => {
      if (reviewIntervalId) window.clearInterval(reviewIntervalId);
      reviewIntervalId = undefined;
    };

    const moveReviewSlide = (position: number) => {
      if (!reviewTrack || reviewSlideCount <= 1 || isReviewAnimating) return;
      isReviewAnimating = true;
      setReviewTrackTransition(true);
      reviewPosition = position;
      setReviewTrackPosition(reviewPosition);
      syncReviewIndex();
    };

    const startReviewAutoPlay = () => {
      if (reviewSlideCount <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      stopReviewAutoPlay();
      reviewIntervalId = window.setInterval(() => {
        if (!isReviewCarouselPaused) moveReviewSlide(reviewPosition + 1);
      }, 4600);
    };

    const reviewTransitionEndHandler = (event: TransitionEvent) => {
      if (event.target !== reviewTrack || event.propertyName !== "transform") return;
      isReviewAnimating = false;
      if (reviewPosition === reviewSlideCount + 1) {
        jumpToReviewPosition(1);
      } else if (reviewPosition === 0) {
        jumpToReviewPosition(reviewSlideCount);
      }
    };
    reviewTrack?.addEventListener("transitionend", reviewTransitionEndHandler);

    if (reviewSlideCount > 1) {
      jumpToReviewPosition(1);
    } else {
      updateReviewDots();
    }
    startReviewAutoPlay();

    const reviewDotHandlers = reviewDots.map((dot, index) => {
      const handler = () => {
        moveReviewSlide(index + 1);
        startReviewAutoPlay();
      };
      dot.addEventListener("click", handler);
      return { dot, handler };
    });

    const reviewPreviousHandler = () => {
      moveReviewSlide(reviewPosition - 1);
      startReviewAutoPlay();
    };
    const reviewNextHandler = () => {
      moveReviewSlide(reviewPosition + 1);
      startReviewAutoPlay();
    };
    reviewPrev?.addEventListener("click", reviewPreviousHandler);
    reviewNext?.addEventListener("click", reviewNextHandler);

    const pauseReviewCarousel = () => {
      isReviewCarouselPaused = true;
    };
    const resumeReviewCarousel = () => {
      isReviewCarouselPaused = false;
    };
    reviewCarousel?.addEventListener("mouseenter", pauseReviewCarousel);
    reviewCarousel?.addEventListener("mouseleave", resumeReviewCarousel);
    reviewCarousel?.addEventListener("focusin", pauseReviewCarousel);
    reviewCarousel?.addEventListener("focusout", resumeReviewCarousel);

    let resetButtonId: number | undefined;
    let toastResetId: number | undefined;
    const toast = document.createElement("div");
    toast.className = "booking-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);

    const showToast = (message: string, type: "success" | "error") => {
      if (toastResetId) window.clearTimeout(toastResetId);
      toast.className = `booking-toast ${type}`;
      toast.textContent = message;
      window.requestAnimationFrame(() => toast.classList.add("visible"));
      toastResetId = window.setTimeout(() => {
        toast.classList.remove("visible");
      }, 3600);
    };

    const submitHandler = async (event: SubmitEvent) => {
      event.preventDefault();
      if (!form || !note) return;

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim() || "你好";
      const arrivalTime = String(data.get("arrivalTime") || "").trim();
      const button = form.querySelector<HTMLButtonElement>("button[type='submit']");
      const arrivalText = arrivalTime ? `，期望 ${arrivalTime.replace("T", " ")} 到店` : "";
      const arrivalDate = arrivalTime ? new Date(arrivalTime) : null;

      if (button) {
        button.disabled = true;
        button.textContent = "提交中...";
      }
      note.textContent = "正在提交预约...";

      try {
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            arrivalTime: arrivalDate?.toISOString() || "",
            name,
            phone: String(data.get("phone") || "").trim(),
            pet: String(data.get("pet") || "").trim(),
            service: String(data.get("service") || "").trim(),
            note: String(data.get("note") || "").trim(),
          }),
        });
        const result = (await response.json().catch(() => null)) as { message?: string } | null;

        if (!response.ok) {
          throw new Error(result?.message || "预约提交失败，请稍后再试。");
        }

        note.textContent = `${name}${arrivalText}，预约已收到。宠瑾安会尽快回电确认。`;
        showToast("预约提交成功，门店会尽快回电确认。", "success");
        form.reset();
        setDefaultArrivalTime();
        if (button) button.textContent = "已提交，等待确认";
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "预约提交失败，请稍后再试或直接电话联系门店。";
        note.textContent = errorMessage;
        showToast(errorMessage, "error");
        if (button) button.innerHTML = `${submitIcon}提交预约`;
      } finally {
        if (button) button.disabled = false;
        resetButtonId = window.setTimeout(() => {
          if (button) button.innerHTML = `${submitIcon}提交预约`;
        }, 2600);
      }
    };

    form?.addEventListener("submit", submitHandler);

    return () => {
      dotHandlers.forEach(({ dot, handler }) => dot.removeEventListener("click", handler));
      environmentPrev?.removeEventListener("click", previousHandler);
      environmentNext?.removeEventListener("click", nextHandler);
      environmentTrack?.removeEventListener("transitionend", transitionEndHandler);
      environmentCarousel?.removeEventListener("mouseenter", pauseCarousel);
      environmentCarousel?.removeEventListener("mouseleave", resumeCarousel);
      environmentCarousel?.removeEventListener("focusin", pauseCarousel);
      environmentCarousel?.removeEventListener("focusout", resumeCarousel);
      reviewDotHandlers.forEach(({ dot, handler }) => dot.removeEventListener("click", handler));
      reviewPrev?.removeEventListener("click", reviewPreviousHandler);
      reviewNext?.removeEventListener("click", reviewNextHandler);
      reviewTrack?.removeEventListener("transitionend", reviewTransitionEndHandler);
      reviewCarousel?.removeEventListener("mouseenter", pauseReviewCarousel);
      reviewCarousel?.removeEventListener("mouseleave", resumeReviewCarousel);
      reviewCarousel?.removeEventListener("focusin", pauseReviewCarousel);
      reviewCarousel?.removeEventListener("focusout", resumeReviewCarousel);
      form?.removeEventListener("submit", submitHandler);
      if (intervalId) window.clearInterval(intervalId);
      if (reviewIntervalId) window.clearInterval(reviewIntervalId);
      if (resetButtonId) window.clearTimeout(resetButtonId);
      if (toastResetId) window.clearTimeout(toastResetId);
      toast.remove();
      if (firstSlideClone?.parentNode === environmentTrack) environmentTrack?.removeChild(firstSlideClone);
      if (lastSlideClone?.parentNode === environmentTrack) environmentTrack?.removeChild(lastSlideClone);
      if (firstReviewClone?.parentNode === reviewTrack) reviewTrack?.removeChild(firstReviewClone);
      if (lastReviewClone?.parentNode === reviewTrack) reviewTrack?.removeChild(lastReviewClone);
    };
  }, []);

  return null;
}
