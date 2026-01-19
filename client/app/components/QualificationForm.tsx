import { type QualificationLeadDto } from 'heatos-shared'
import React, { useState } from 'react'

import { HEATING_SYSTEM_TYPES, PROJECT_TIMELINES, PROPERTY_TYPES } from '../constants/formOptions'
import type { MinimalData } from '../hooks/useFunnel'
import { formStyles } from '../styles/formStyles'

interface QualificationFormProps {
  initialData: MinimalData
  onSubmit: (data: QualificationLeadDto) => void
  isSubmitting: boolean
}

export function QualificationForm({ initialData, onSubmit, isSubmitting }: QualificationFormProps) {
  const [formData, setFormData] = useState({
    address: {
      street: '',
      city: '',
      postalCode: '',
      countryCode: 'DE',
    },
    buildingInformation: {
      immoType: 'Single-family / Two-family house' as const,
      constructionYearString: '',
      heritageProtection: 'No' as const,
      boilerRoomSize: 'more than 4 sqm' as const,
      installationLocationCeilingHeight: 'higher than 199 cm' as const,
      widthPathway: 'Yes' as const,
      heightPathway: 'Yes' as const,
      personsHousehold: 1,
    },
    ownershipRelationships: {
      type: 'one_owner' as const,
    },
    energyRelevantInformation: {
      heatedArea: 0,
      locationHeating: 'Basement' as const,
    },
    heatingSystem: {
      systemType: 'Natural gas' as const,
      consumption: 0,
      consumptionUnit: 'Kilowatt hours (kWh)' as const,
    },
    project: {
      timeline: 'Immediately' as const,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const qualificationData: QualificationLeadDto = {
      version: '1.2.0',
      leadStage: 'qualification',
      contact: {
        contactInformation: initialData.contact.contactInformation,
        address: formData.address,
      },
      building: {
        address: formData.address,
        buildingInformation: formData.buildingInformation,
        ownershipRelationships: formData.ownershipRelationships,
        energyRelevantInformation: formData.energyRelevantInformation,
      },
      heatingSystem: formData.heatingSystem,
      project: formData.project,
    }

    onSubmit(qualificationData)
  }

  return (
    <div className={formStyles.containerLarge}>
      <h2 className={formStyles.heading}>Property Qualification</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                id="street"
                type="text"
                required
                value={formData.address.street}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value },
                  }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="city" className={formStyles.label}>
                City *
              </label>
              <input
                id="city"
                type="text"
                required
                value={formData.address.city}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="postalCode" className={formStyles.label}>
                Postal Code *
              </label>
              <input
                id="postalCode"
                type="text"
                required
                value={formData.address.postalCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, postalCode: e.target.value },
                  }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Building Information */}
        <div className={formStyles.sectionBorder}>
          <h3 className={formStyles.subheading}>Building Information</h3>
          <div className={formStyles.grid.double}>
            <div>
              <label htmlFor="immoType" className={formStyles.label}>
                Property Type
              </label>
              <select
                required
                id="immoType"
                value={formData.buildingInformation.immoType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buildingInformation: {
                      ...prev.buildingInformation,
                      immoType: e.target.value as any,
                    },
                  }))
                }
                className={formStyles.select}
                disabled={isSubmitting}
              >
                {PROPERTY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="constructionYear" className={formStyles.label}>
                Construction Year
              </label>
              <input
                id="constructionYear"
                type="text"
                required
                value={formData.buildingInformation.constructionYearString}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buildingInformation: {
                      ...prev.buildingInformation,
                      constructionYearString: e.target.value,
                    },
                  }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="heatedArea" className={formStyles.label}>
                Heated Area (sqm)
              </label>
              <input
                id="heatedArea"
                type="number"
                required
                value={formData.energyRelevantInformation.heatedArea}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    energyRelevantInformation: {
                      ...prev.energyRelevantInformation,
                      heatedArea: Number(e.target.value),
                    },
                  }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="personsHousehold" className={formStyles.label}>
                Persons in Household
              </label>
              <input
                id="personsHousehold"
                type="number"
                required
                value={formData.buildingInformation.personsHousehold}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buildingInformation: {
                      ...prev.buildingInformation,
                      personsHousehold: Number(e.target.value),
                    },
                  }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Heating System */}
        <div className={formStyles.sectionBorder}>
          <h3 className={formStyles.subheading}>Heating System</h3>
          <div className={formStyles.grid.double}>
            <div>
              <label htmlFor="systemType" className={formStyles.label}>
                Current Heating System
              </label>
              <select
                required
                id="systemType"
                value={formData.heatingSystem.systemType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    heatingSystem: { ...prev.heatingSystem, systemType: e.target.value as any },
                  }))
                }
                className={formStyles.select}
                disabled={isSubmitting}
              >
                {HEATING_SYSTEM_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="consumption" className={formStyles.label}>
                Annual Consumption
              </label>
              <input
                id="consumption"
                type="number"
                required
                value={formData.heatingSystem.consumption}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    heatingSystem: { ...prev.heatingSystem, consumption: Number(e.target.value) },
                  }))
                }
                className={formStyles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Project Timeline */}
        <div>
          <h3 className={formStyles.subheading}>Project Timeline</h3>
          <div>
            <label htmlFor="timeline" className={formStyles.label}>
              When would you like to install the heat pump?
            </label>
            <select
              required
              id="timeline"
              value={formData.project.timeline}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  project: { ...prev.project, timeline: e.target.value as any },
                }))
              }
              className={formStyles.select}
              disabled={isSubmitting}
            >
              {PROJECT_TIMELINES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className={formStyles.buttonPrimary}>
          {isSubmitting ? 'Saving...' : 'Save & Next'}
        </button>
      </form>
    </div>
  )
}
