import { z } from 'zod'

import { DiscoveryLeadSchema, DiscoveryProjectSchema } from './discovery.dto'

export const PictureSchema = z.object({
    url: z.string().url('Picture URL must be valid')
})

export type PictureDto = z.infer<typeof PictureSchema>

export const PicturesSchema = z.object({
    outdoorUnitLocation: z.array(PictureSchema),
    outdoorUnitLocationWithArea: z.array(PictureSchema),
    heatingRoom: z.array(PictureSchema),
    meterClosetWithDoorOpen: z.array(PictureSchema),
    meterClosetSlsSwitchDetailed: z.array(PictureSchema),
    floorHeatingDistributionWithDoorOpen: z.array(PictureSchema)
})

export type PicturesDto = z.infer<typeof PicturesSchema>

export const SellingProjectSchema = DiscoveryProjectSchema.extend({
    pictures: PicturesSchema
})

export type SellingProjectDto = z.infer<typeof SellingProjectSchema>

export const SellingLeadSchema = DiscoveryLeadSchema.extend({
    project: SellingProjectSchema
})

export type SellingLeadDto = z.infer<typeof SellingLeadSchema>
