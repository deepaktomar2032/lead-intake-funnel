export const HEATING_TYPES = [
  { value: 'Radiator', label: 'Radiator' },
  { value: 'Floor heating', label: 'Floor heating' },
  { value: 'Radiator + Floor heating', label: 'Radiator + Floor heating' },
  { value: 'Night storage heater', label: 'Night storage heater' },
  { value: 'Other', label: 'Other' },
] as const

export const HOUSEHOLD_INCOME_OPTIONS = [
  { value: 'more_than_40k_gross', label: 'More than 40k gross' },
  { value: 'less_than_40k_gross', label: 'Less than 40k gross' },
  { value: 'no_answer', label: 'Prefer not to answer' },
] as const

export const PROPERTY_TYPES = [
  { value: 'Single-family / Two-family house', label: 'Single-family / Two-family house' },
  { value: 'Semi-detached / Terraced house', label: 'Semi-detached / Terraced house' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Multi-family house', label: 'Multi-family house' },
  { value: 'Other', label: 'Other' },
] as const

export const HEATING_SYSTEM_TYPES = [
  { value: 'Natural gas', label: 'Natural gas' },
  { value: 'Heating oil', label: 'Heating oil' },
  { value: 'Heat pump', label: 'Heat pump' },
  { value: 'District heating', label: 'District heating' },
  { value: 'Pellet/Wood heating', label: 'Pellet/Wood heating' },
  { value: 'Other', label: 'Other' },
] as const

export const PROJECT_TIMELINES = [
  { value: 'Immediately', label: 'Immediately' },
  { value: '1-3 months', label: '1-3 months' },
  { value: '3-6 months', label: '3-6 months' },
  { value: '>6 months', label: 'More than 6 months' },
] as const

export type HeatingType = (typeof HEATING_TYPES)[number]['value']
export type HouseholdIncome = (typeof HOUSEHOLD_INCOME_OPTIONS)[number]['value']
export type PropertyType = (typeof PROPERTY_TYPES)[number]['value']
export type HeatingSystemType = (typeof HEATING_SYSTEM_TYPES)[number]['value']
export type ProjectTimeline = (typeof PROJECT_TIMELINES)[number]['value']
