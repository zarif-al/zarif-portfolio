import type { Block } from 'payload'
import { Hero } from './buildable/hero'
import { Richtext } from './buildable/richtext'
import { TerminalBlock } from './buildable/terminal-block'
import { CardGrid } from './buildable/card-grid'
import { CollectionList } from './buildable/collection-list'
import { Contact } from './buildable/contact'
import { EntryList } from './buildable/entry-list'
import { Equalizer } from './buildable/equalizer'

export const ALL_PAGE_BLOCKS: Block[] = [
  Hero,
  Richtext,
  TerminalBlock,
  CardGrid,
  CollectionList,
  Contact,
  EntryList,
  Equalizer,
]
