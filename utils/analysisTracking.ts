/**
 * Store current page path in session storage when analysis starts
 * @param path - The current page path
 */
export const setAnalysisStartPage = (path: string): void => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("analysisStartPage", path);
  }
};

/**
 * Get the page path where analysis started
 * @returns The stored path or null if not found
 */
export const getAnalysisStartPage = (): string | null => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("analysisStartPage");
  }
  return null;
};

/**
 * Clear the analysis start page from session storage
 */
export const clearAnalysisStartPage = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("analysisStartPage");
  }
};

/**
 * Custom event name for analysis completion
 */
export const ANALYSIS_COMPLETE_EVENT = "analysis_complete";

/**
 * Function to emit the analysis complete event
 */
export const notifyAnalysisComplete = (): void => {
  // Create and dispatch a custom event that can be listened to across components
  if (typeof window !== "undefined") {
    const event = new CustomEvent(ANALYSIS_COMPLETE_EVENT);
    window.dispatchEvent(event);
  }
};
