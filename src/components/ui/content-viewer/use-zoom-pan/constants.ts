/**
 * Maximum absolute zoom level a user can reach via manual zoom
 * (Ctrl + wheel, pinch, or toolbar buttons).
 */
export const ZOOM_MAX = 10

/**
 * Maximum upscale factor applied when fitting content to the viewport
 * on dialog open.  Manual zoom is still gated by {@link ZOOM_MAX}.
 */
export const FIT_MAX_UPSCALE = 4

/** Zoom multiplier per Ctrl + wheel tick. */
export const SCROLL_ZOOM_FACTOR = 1.08

/** Zoom multiplier per toolbar button click. */
export const BUTTON_ZOOM_FACTOR = 1.25
