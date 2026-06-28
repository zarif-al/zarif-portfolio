/** Return value of {@link useMermaidRender}. */
export interface UseMermaidRenderResult {
  /** Rendered SVG markup, or `null` while loading / on error. */
  svg: string | null
  /** Parse or render error message, or `null` on success. */
  error: string | null
  /** Natural pixel width parsed from the SVG `viewBox` attribute. */
  naturalWidth: number
}
