import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { buildHeader, buildFooter, buildHeroBlock, buildCtaBlock, buildRichtextBlock } from './data'
import { upsertPage } from './helpers'

async function seed() {
  const payload = await getPayload({ config: configPromise })

  // Pass 1: seed pages
  console.log('Seeding Home page…')
  const homePage = await upsertPage(payload, '/', 'Home', [
    buildHeroBlock({ overline: 'Welcome' }),
    buildCtaBlock(),
    buildRichtextBlock({ heading: 'What we do' }),
  ])

  console.log('Seeding About page…')
  const aboutPage = await upsertPage(payload, '/about', 'About', [
    buildHeroBlock({ overline: 'Our story', title: 'About our team' }),
    buildRichtextBlock({ heading: 'Our mission' }),
    buildCtaBlock({ title: 'Join us', description: 'Become part of something great.' }),
  ])

  // Pass 2: update Layout with resolved internal references
  console.log('Seeding Layout…')
  await payload.updateGlobal({
    slug: 'layout',
    data: {
      header: buildHeader({ '/': homePage, '/about': aboutPage }),
      footer: buildFooter({ '/': homePage, '/about': aboutPage }),
    },
  })

  console.log('Seed complete.')
}

seed()
  .then(() => {
    process.exit(0)
  })
  .catch((error: unknown) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
