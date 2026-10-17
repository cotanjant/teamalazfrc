"use client";

import { useEffect } from "react";
import type { Driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tourStyles.css";
import { TOUR_CONFIG, TOUR_STEPS, TOUR_STORAGE_KEY } from "./tourConfig";

export const START_TOUR_EVENT = "alaz:start-tour";

let activeDriver: Driver | null = null;
let isTourStarting = false;

/**
 * Triggers the interactive Driver.js admin tour programmatically
 * from any component or action with dynamic lazy loading.
 */
export async function startAdminTour() {
  if (typeof window === "undefined" || isTourStarting) return;
  isTourStarting = true;

  try {
    const { driver } = await import("driver.js");

    if (activeDriver?.isActive()) {
      try {
        activeDriver.destroy();
      } catch {
        // Safe destroy fallback
      }
    }

    const driverInstance = driver({
      ...TOUR_CONFIG,
      steps: TOUR_STEPS,
      onDestroyed: () => {
        try {
          localStorage.setItem(TOUR_STORAGE_KEY, "true");
        } catch {
          // Ignore localStorage failure in restricted browser sandboxes
        }
      },
    });

    activeDriver = driverInstance;

    // Replace fragile setTimeout with requestAnimationFrame and DOM target element check
    let frameCount = 0;
    const maxFrames = 120; // ~2 seconds safety threshold
    const waitForTargetAndDrive = () => {
      const targetElement = document.querySelector("#admin-sidebar") || document.querySelector("#admin-active-section");
      if (targetElement || frameCount >= maxFrames) {
        driverInstance.drive(0);
        isTourStarting = false;
      } else {
        frameCount++;
        requestAnimationFrame(waitForTargetAndDrive);
      }
    };

    requestAnimationFrame(waitForTargetAndDrive);
  } catch (err) {
    isTourStarting = false;
    console.error("Failed to load or start admin tour:", err);
  }
}

export function AdminTour() {
  useEffect(() => {
    const handleStartTour = () => {
      void startAdminTour();
    };

    // Listen for manual restart event
    window.addEventListener(START_TOUR_EVENT, handleStartTour);

    // Auto-start on initial visit if tour has not been completed
    try {
      const isCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!isCompleted) {
        void startAdminTour();
      }
    } catch {
      // Ignore localStorage error
    }

    return () => {
      window.removeEventListener(START_TOUR_EVENT, handleStartTour);
      try {
        if (activeDriver?.isActive()) {
          activeDriver.destroy();
        }
      } catch {
        // Safe cleanup
      }
    };
  }, []);

  return null;
}
