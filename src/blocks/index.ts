import type { Block } from 'payload'
import { Hero } from './hero/hero'
import { Richtext } from './richtext/richtext'
import { TerminalBlock } from './terminal-block/terminal-block'
import { CardGrid } from './card-grid/card-grid'
import { CollectionList } from './collection-list/collection-list'
import { Contact } from './contact/contact'
import { EntryList } from './entry-list/entry-list'

export const ALL_PAGE_BLOCKS: Block[] = [
  Hero,
  Richtext,
  TerminalBlock,
  CardGrid,
  CollectionList,
  Contact,
  EntryList,
]
