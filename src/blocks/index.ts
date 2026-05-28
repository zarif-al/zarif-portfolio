import type { Block } from 'payload'
import { Hero } from './hero/hero'
import { Cta } from './cta/cta'
import { Richtext } from './richtext/richtext'

export const ALL_PAGE_BLOCKS: Block[] = [Hero, Cta, Richtext]
