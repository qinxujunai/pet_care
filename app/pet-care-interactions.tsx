"use client";

import { useEffect } from "react";

const submitIcon =
  '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M22 2 11 13"></path><path d="m22 2-7 20-4-9-9-4 20-7Z"></path></svg></span>';

export function PetCareInteractions() {
  useEffect(() => {
    const form = document.getElementById("bookingForm") as HTMLFormElement | null;
    const note = document.getElementById("formNote");
    const timeChips = Array.from(document.querySelectorAll<HTMLButtonElement>(".time-chip"));
    const environmentTrack = document.querySelector<HTMLElement>(".environment-track");
    const environmentDots = Array.from(document.querySelectorAll<HTMLButtonElement>(".environment-dot"));
    const environmentPrev = document.querySelector<HTMLButtonElement>(".carousel-arrow.prev");
    const environmentNext = document.querySelector<HTMLButtonElement>(".carousel-arrow.next");
    const environmentCarousel = document.querySelector<HTMLElement>(".environment-carousel");
    const environmentSlides = Array.from(document.querySelectorAll<HTMLElement>(".environment-slide"));
    const environmentSlideCount = environmentSlides.length;
    let environmentIndex = 0;
    let environmentPosition = environmentSlideCount > 1 ? 1 : 0;
    let isCarouselPaused = false;
    let isEnvironmentAnimating = false;
    let intervalId: number | undefined;

    const firstSlideClone = environmentSlideCount > 1 ? environmentSlides[0].cloneNode(true) : null;
    const lastSlideClone =
      environmentSlideCount > 1 ? environmentSlides[environmentSlideCount - 1].cloneNode(true) : null;

    firstSlideClone instanceof HTMLElement && firstSlideClone.setAttribute("aria-hidden", "true");
    lastSlideClone instanceof HTMLElement && lastSlideClone.setAttribute("aria-hidden", "true");
    if (environmentTrack && firstSlideClone && lastSlideClone) {
      environmentTrack.prepend(lastSlideClone);
      environmentTrack.append(firstSlideClone);
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

    const chipHandlers = timeChips.map((chip) => {
      const handler = () => {
        timeChips.forEach((item) => item.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
      };
      chip.addEventListener("click", handler);
      return { chip, handler };
    });

    let resetButtonId: number | undefined;
    const submitHandler = (event: SubmitEvent) => {
      event.preventDefault();
      if (!form || !note) return;

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim() || "你好";
      const button = form.querySelector<HTMLButtonElement>("button[type='submit']");

      note.textContent = `${name}，预约已收到。宠瑾安会尽快回电确认。`;
      if (button) button.textContent = "已提交，等待确认";

      resetButtonId = window.setTimeout(() => {
        if (button) button.innerHTML = `${submitIcon}提交预约`;
      }, 2600);
    };

    form?.addEventListener("submit", submitHandler);

    return () => {
      dotHandlers.forEach(({ dot, handler }) => dot.removeEventListener("click", handler));
      chipHandlers.forEach(({ chip, handler }) => chip.removeEventListener("click", handler));
      environmentPrev?.removeEventListener("click", previousHandler);
      environmentNext?.removeEventListener("click", nextHandler);
      environmentTrack?.removeEventListener("transitionend", transitionEndHandler);
      environmentCarousel?.removeEventListener("mouseenter", pauseCarousel);
      environmentCarousel?.removeEventListener("mouseleave", resumeCarousel);
      environmentCarousel?.removeEventListener("focusin", pauseCarousel);
      environmentCarousel?.removeEventListener("focusout", resumeCarousel);
      form?.removeEventListener("submit", submitHandler);
      if (intervalId) window.clearInterval(intervalId);
      if (resetButtonId) window.clearTimeout(resetButtonId);
      if (firstSlideClone?.parentNode === environmentTrack) environmentTrack?.removeChild(firstSlideClone);
      if (lastSlideClone?.parentNode === environmentTrack) environmentTrack?.removeChild(lastSlideClone);
    };
  }, []);

  return null;
}
