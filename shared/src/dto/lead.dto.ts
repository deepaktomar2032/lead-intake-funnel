import { z } from 'zod'

import { DiscoveryLeadSchema } from './discovery.dto'
import { MinimalLeadSchema } from './minimal.dto'
import { QualificationLeadSchema } from './qualification.dto'
import { SellingLeadSchema } from './selling.dto'

export const leadStageOrder = ['selling', 'discovery', 'qualification', 'minimal'] as const
export type LeadStage = (typeof leadStageOrder)[number]

const SellingLeadVariantSchema = SellingLeadSchema.extend({
    leadStage: z.literal('selling').default('selling')
})

const DiscoveryLeadVariantSchema = DiscoveryLeadSchema.extend({
    leadStage: z.literal('discovery').default('discovery')
})

const QualificationLeadVariantSchema = QualificationLeadSchema.extend({
    leadStage: z.literal('qualification').default('qualification')
})

const MinimalLeadVariantSchema = MinimalLeadSchema.extend({
    leadStage: z.literal('minimal').default('minimal')
})

// Request Schema
export const LeadRequestSchema = z.discriminatedUnion('leadStage', [
    SellingLeadVariantSchema,
    DiscoveryLeadVariantSchema,
    QualificationLeadVariantSchema,
    MinimalLeadVariantSchema
])

export type LeadRequestDto = z.infer<typeof LeadRequestSchema>

// Create Lead Response Schema
export const LeadResponseSchema = z.object({
    leadStage: z.enum(leadStageOrder),
    dataAcquisitionLink: z.url().nullable(),
    appointmentBookingLink: z.url().nullable(),
    existingData: z.any().optional()
})

export type LeadResponseDto = z.infer<typeof LeadResponseSchema>
