import { z } from 'zod'

import {
    AddressSchema,
    BuildingInformationSchema,
    EnergyRelevantInformationSchema,
    HeatingSystemSchema,
    OwnershipRelationshipsSchema,
    ProjectSchema,
    QualificationLeadSchema
} from './qualification.dto'

export const DiscoveryBuildingInformationSchema = BuildingInformationSchema.extend({
    livingSpace: z.number(),
    residentialUnits: z.number(),
    roomsBetweenHeatingRoomAndOutdoorUnit: z.enum(['no_room', 'one_room', 'two_rooms_or_more'] as const),
    meterClosetLocation: z.enum(['Basement', 'Ground floor', 'Upper floor', 'Attic'] as const),
    electricityConnectionLocation: z.enum(['Basement', 'Ground floor', 'Upper floor', 'Attic'] as const),
    groundingType: z.enum(['water_or_gas_pipe', 'grounding_spike_or_foundation', 'no_grounding', 'unknown'] as const),
    hasSolarThermalSystem: z.boolean()
})

export type DiscoveryBuildingInformationDto = z.infer<typeof DiscoveryBuildingInformationSchema>

export const DiscoveryOwnershipRelationshipsSchema = OwnershipRelationshipsSchema.extend({
    ownerOccupiedHousing: z.boolean()
})

export type DiscoveryOwnershipRelationshipsDto = z.infer<typeof DiscoveryOwnershipRelationshipsSchema>

export const DiscoveryEnergyRelevantInformationSchema = EnergyRelevantInformationSchema.extend({
    typeOfHeating: z.enum([
        'Radiator',
        'Floor heating',
        'Radiator + Floor heating',
        'Night storage heater',
        'Other'
    ] as const)
})

export type DiscoveryEnergyRelevantInformationDto = z.infer<typeof DiscoveryEnergyRelevantInformationSchema>

export const DiscoveryHeatingSystemSchema = HeatingSystemSchema.extend({
    constructionYearHeatingSystem: z.number(),
    floorHeatingConnectedToReturnPipe: z.boolean(),
    floorHeatingOwnHeatingCircuit: z.boolean(),
    floorHeatingOnlyInSmallRooms: z.boolean(),
    numberOfFloorHeatingDistributors: z.number(),
    numberOfRadiators: z.number(),
    domesticHotWaterByHeatpump: z.boolean(),
    domesticHotWaterCirculationPump: z.enum(['no', 'unknown', 'yes_but_inactive', 'yes_and_active'] as const),
    domestic_water_station: z.enum(['no', 'unknown', 'yes', 'water_filter_and_pressure_reducer'] as const)
})

export type DiscoveryHeatingSystemDto = z.infer<typeof DiscoveryHeatingSystemSchema>

const disposalOptions = [
    'oil_tank_plastic_up_to_5000l',
    'oil_tank_plastic_more_than_5000l',
    'oil_tank_steel_up_to_5000l',
    'oil_tank_steel_more_than_5000l',
    'heatpump',
    'liquid_gas_tank'
] as const

export const DiscoveryProjectSchema = ProjectSchema.extend({
    householdIncome: z.enum(['more_than_40k_gross', 'less_than_40k_gross', 'no_answer'] as const),
    statusOfFoundationConstruction: z.enum(['Vamo', 'Customer', 'No foundation necessary'] as const),
    fullReplacementOfHeatingSystemPlanned: z.boolean(),
    additionalDisposal: z.array(z.enum(disposalOptions))
})

export type DiscoveryProjectDto = z.infer<typeof DiscoveryProjectSchema>

export const DiscoveryBuildingSchema = z.object({
    address: AddressSchema,
    buildingInformation: DiscoveryBuildingInformationSchema,
    ownershipRelationships: DiscoveryOwnershipRelationshipsSchema,
    energyRelevantInformation: DiscoveryEnergyRelevantInformationSchema
})

export type DiscoveryBuildingDto = z.infer<typeof DiscoveryBuildingSchema>

export const DiscoveryLeadSchema = QualificationLeadSchema.extend({
    building: DiscoveryBuildingSchema,
    heatingSystem: DiscoveryHeatingSystemSchema,
    project: DiscoveryProjectSchema
})

export type DiscoveryLeadDto = z.infer<typeof DiscoveryLeadSchema>
