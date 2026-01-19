import { z } from 'zod'

const phoneSchema = z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .transform((value: string) => value.replace(/\s+/g, ''))
    .refine((value: string) => value.startsWith('+49'), {
        message: 'Phone number must start with +49'
    })

export const ContactInformationSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: phoneSchema,
    email: z.string().email({ message: 'Invalid email address' })
})

export type ContactInformationDto = z.infer<typeof ContactInformationSchema>

export const ContactSchema = z.object({
    contactInformation: ContactInformationSchema
})

export type ContactDto = z.infer<typeof ContactSchema>

export const MinimalLeadSchema = z.object({
    version: z.literal('1.2.0'),
    leadStage: z.enum(['selling', 'discovery', 'qualification', 'minimal']),
    contact: ContactSchema
})

export type MinimalLeadDto = z.infer<typeof MinimalLeadSchema>
