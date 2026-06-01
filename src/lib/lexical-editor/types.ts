/** Valid heading tag types for the Lexical editor. */
export type HeadingTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingsConfig {
  /** When `false`, heading features are removed from the toolbar. Defaults to `true`. */
  enabled?: boolean
  /** Restrict heading sizes. When omitted, all sizes (h1–h6) are available. */
  allowedSizes?: HeadingTagType[]
}

export interface CustomLexicalOptions {
  headingsConfig?: HeadingsConfig
  /**
   * When `false`, the paragraph feature is removed from the toolbar.
   */
  allowParagraph?: boolean
  /**
   * When `true`, enables the Code block feature via {@link BlocksFeature}.
   * Only enabled for meta-tab richtext (blog/project body).
   *
   * @default false
   */
  codeBlock?: boolean
}
