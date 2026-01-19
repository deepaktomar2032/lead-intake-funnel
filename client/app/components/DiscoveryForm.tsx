import { type DiscoveryLeadDto, type QualificationLeadDto } from 'heatos-shared'
import React, { useState } from 'react'

import { HEATING_TYPES, HOUSEHOLD_INCOME_OPTIONS } from '../constants/formOptions'
import { formStyles } from '../styles/formStyles'

interface DiscoveryFormProps {
  initialData: QualificationLeadDto
  onSubmit: (data: DiscoveryLeadDto) => void
  isSubmitting: boolean
}

export function DiscoveryForm({ initialData, onSubmit, isSubmitting }: DiscoveryFormProps) {
  const [formData, setFormData] = useState({
    livingSpace: 0,
    residentialUnits: 1,
    typeOfHeating: 'Radiator' as
      | 'Radiator'
      | 'Floor heating'
      | 'Radiator + Floor heating'
      | 'Night storage heater'
      | 'Other',
    constructionYearHeatingSystem: new Date().getFullYear() - 10,
    numberOfRadiators: 0,
    householdIncome: 'more_than_40k_gross' as
      | 'more_than_40k_gross'
      | 'less_than_40k_gross'
      | 'no_answer',
    fullReplacementOfHeatingSystemPlanned: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const discoveryData: DiscoveryLeadDto = {
      ...initialData,
      leadStage: 'discovery',
      building: {
        address: initialData.building.address,
        buildingInformation: {
          ...initialData.building.buildingInformation,
          livingSpace: formData.livingSpace,
          residentialUnits: formData.residentialUnits,
          roomsBetweenHeatingRoomAndOutdoorUnit: 'no_room' as const,
          meterClosetLocation: 'Basement' as const,
          electricityConnectionLocation: 'Basement' as const,
          groundingType: 'water_or_gas_pipe' as const,
          hasSolarThermalSystem: false,
        },
        ownershipRelationships: {
          ...initialData.building.ownershipRelationships,
          ownerOccupiedHousing: true,
        },
        energyRelevantInformation: {
          ...initialData.building.energyRelevantInformation,
          typeOfHeating: formData.typeOfHeating,
        },
      },
      heatingSystem: {
        ...initialData.heatingSystem,
        constructionYearHeatingSystem: formData.constructionYearHeatingSystem,
        floorHeatingConnectedToReturnPipe: false,
        floorHeatingOwnHeatingCircuit: false,
        floorHeatingOnlyInSmallRooms: false,
        numberOfFloorHeatingDistributors: 1,
        numberOfRadiators: formData.numberOfRadiators,
        domesticHotWaterByHeatpump: false,
        domesticHotWaterCirculationPump: 'no' as const,
        domestic_water_station: 'no' as const,
      },
      project: {
        ...initialData.project,
        householdIncome: formData.householdIncome,
        statusOfFoundationConstruction: 'Vamo' as const,
        fullReplacementOfHeatingSystemPlanned: formData.fullReplacementOfHeatingSystemPlanned,
        additionalDisposal: [],
      },
    }

    onSubmit(discoveryData)
  }

  return (
    <div className={formStyles.containerLarge}>
      <h2 className={formStyles.heading}>Discovery Phase</h2>

      <form onSubmit={handleSubmit} className={formStyles.formSection}>
        <div className={formStyles.sectionBorder}>
          <h3 className={formStyles.subheading}>Additional Building Details</h3>
          <div className={formStyles.grid.double}>
            <div>
              <label htmlFor="livingSpace" className={formStyles.label}>
                Living Space (sqm)
              </label>
              <input
                id="livingSpace"
                type="number"
                required
                value={formData.livingSpace}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, livingSpace: Number(e.target.value) }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="residentialUnits" className={formStyles.label}>
                Residential Units
              </label>
              <input
                id="residentialUnits"
                type="number"
                required
                value={formData.residentialUnits}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, residentialUnits: Number(e.target.value) }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="typeOfHeating" className={formStyles.label}>
                Type of Heating
              </label>
              <select
                required
                id="typeOfHeating"
                value={formData.typeOfHeating}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, typeOfHeating: e.target.value as any }))
                }
                className={formStyles.select}
                disabled={isSubmitting}
              >
                {HEATING_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={formStyles.sectionBorder}>
          <h3 className={formStyles.subheading}>Heating System Details</h3>
          <div className={formStyles.grid.double}>
            <div>
              <label htmlFor="constructionYear" className={formStyles.label}>
                Heating System Construction Year
              </label>
              <input
                id="constructionYear"
                type="number"
                required
                value={formData.constructionYearHeatingSystem}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    constructionYearHeatingSystem: Number(e.target.value),
                  }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="numberOfRadiators" className={formStyles.label}>
                Number of Radiators
              </label>
              <input
                id="numberOfRadiators"
                type="number"
                required
                value={formData.numberOfRadiators}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, numberOfRadiators: Number(e.target.value) }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className={formStyles.sectionBorder}>
          <h3 className={formStyles.subheading}>Project Information</h3>
          <div className={formStyles.form}>
            <div>
              <label htmlFor="householdIncome" className={formStyles.label}>
                Household Income
              </label>
              <select
                required
                id="householdIncome"
                value={formData.householdIncome}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, householdIncome: e.target.value as any }))
                }
                className={formStyles.select}
                disabled={isSubmitting}
              >
                {HOUSEHOLD_INCOME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={formStyles.checkboxWrapper}>
              <input
                id="fullReplacement"
                type="checkbox"
                checked={formData.fullReplacementOfHeatingSystemPlanned}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullReplacementOfHeatingSystemPlanned: e.target.checked,
                  }))
                }
                className={formStyles.checkbox}
                disabled={isSubmitting}
              />
              <label htmlFor="fullReplacement" className={formStyles.checkboxLabel}>
                Full replacement of heating system planned
              </label>
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className={formStyles.buttonPrimary}>
          {isSubmitting ? 'Saving...' : 'Save & Next'}
        </button>
      </form>
    </div>
  )
}
