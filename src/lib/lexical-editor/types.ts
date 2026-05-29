/** Valid heading tag types for the Lexical editor. */
export type HeadingTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface CustomLexicalOptions {
  /**
   * Restrict heading sizes. When omitted, all sizes (h1–h6) are available.
   */
  enabledHeadingSizes?: HeadingTagType[]
  /**
   * When `false`, the paragraph feature is removed from the toolbar.
   */
  allowParagraph?: boolean
}
