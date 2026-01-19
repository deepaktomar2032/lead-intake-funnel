import { z } from 'zod'

import { ContactSchema, MinimalLeadSchema } from './minimal.dto'

export const AddressSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    countryCode: z.string().min(1, 'Country code is required')
})

export type AddressDto = z.infer<typeof AddressSchema>

export const QualificationContactSchema = ContactSchema.extend({
    address: AddressSchema
})

export type QualificationContactDto = z.infer<typeof QualificationContactSchema>

const immoTypeValues = [
    'Single-family / Two-family house',
    'Semi-detached / Terraced house',
    'Apartment',
    'Commercial',
    'Multi-family house',
    'Other'
] as const

const yesNoValues = ['Yes', 'No'] as const

const ceilingHeightValues = ['lower than 180 cm', '180 - 199 cm', 'higher than 199 cm'] as const

export const BuildingInformationSchema = z.object({
    immoType: z.enum(immoTypeValues),
    constructionYearString: z.string(),
    heritageProtection: z.enum(yesNoValues),
    boilerRoomSize: z.enum(['less than 4 sqm', 'more than 4 sqm'] as const),
    installationLocationCeilingHeight: z.enum(ceilingHeightValues),
    widthPathway: z.enum(yesNoValues),
    heightPathway: z.enum(yesNoValues),
    personsHousehold: z.number()
})

export type BuildingInformationDto = z.infer<typeof BuildingInformationSchema>

export const OwnershipRelationshipsSchema = z.object({
    type: z.enum(['one_owner', 'two_owners', 'community_of_owners'] as const)
})

export type OwnershipRelationshipsDto = z.infer<typeof OwnershipRelationshipsSchema>

const heatingLocationValues = [
    'Under the roof',
    'In the basement',
    'On ground floor',
    '1st floor',
    'Attic',
    'Upper floor',
    'Basement',
    'Ground floor'
] as const

export const EnergyRelevantInformationSchema = z.object({
    heatedArea: z.number(),
    locationHeating: z.enum(heatingLocationValues)
})

export type EnergyRelevantInformationDto = z.infer<typeof EnergyRelevantInformationSchema>

export const BuildingSchema = z.object({
    address: AddressSchema,
    buildingInformation: BuildingInformationSchema,
    ownershipRelationships: OwnershipRelationshipsSchema,
    energyRelevantInformation: EnergyRelevantInformationSchema
})

export type BuildingDto = z.infer<typeof BuildingSchema>

const heatingSystemValues = [
    'District heating',
    'Gas floor heating',
    'Coal',
    'Heating oil',
    'Heat pump',
    'Natural gas',
    'Liquid gas',
    'Pellet/Wood heating',
    'Other'
] as const

export const HeatingSystemSchema = z.object({
    systemType: z.enum(heatingSystemValues),
    consumption: z.number(),
    consumptionUnit: z.enum(['Liters (l)', 'Kilowatt hours (kWh)'] as const)
})

export type HeatingSystemDto = z.infer<typeof HeatingSystemSchema>

export const ProjectSchema = z.object({
    timeline: z.enum(['Immediately', '1-3 months', '3-6 months', '>6 months'] as const)
})

export type ProjectDto = z.infer<typeof ProjectSchema>

export const QualificationLeadSchema = MinimalLeadSchema.extend({
    contact: QualificationContactSchema,
    building: BuildingSchema,
    heatingSystem: HeatingSystemSchema,
    project: ProjectSchema
})

export type QualificationLeadDto = z.infer<typeof QualificationLeadSchema>
