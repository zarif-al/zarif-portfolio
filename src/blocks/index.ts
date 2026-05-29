import type { Block } from 'payload'
import { Hero } from './hero'
import { Richtext } from './richtext'
import { TerminalBlock } from './terminal-block'
import { CardGrid } from './card-grid'
import { CollectionList } from './collection-list'
import { Contact } from './contact'
import { EntryList } from './entry-list'

export const ALL_PAGE_BLOCKS: Block[] = [
  Hero,
  Richtext,
  TerminalBlock,
  CardGrid,
  CollectionList,
  Contact,
  EntryList,
]
