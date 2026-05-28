import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash'
import { Jimp } from 'jimp'

export async function generateImagePlaceholder(srcImageBuffer: Buffer) {
  try {
    const image = await Jimp.read(srcImageBuffer)
    image.resize({ w: 100, h: 100 })
    const { data, width, height } = image.bitmap

    const thumbhash = rgbaToThumbHash(width, height, data)

    return thumbHashToDataURL(thumbhash)
  } catch (error) {
    console.error('[Generate Image Placeholder] Failed to generate image placeholder', { error })

    return null
  }
}
