import { type DiscoveryLeadDto, type SellingLeadDto } from 'heatos-shared'
import React, { useState } from 'react'

import { formStyles } from '../styles/formStyles'

interface SellingFormProps {
  initialData: DiscoveryLeadDto
  onSubmit: (data: SellingLeadDto) => void
  isSubmitting: boolean
}

export function SellingForm({ initialData, onSubmit, isSubmitting }: SellingFormProps) {
  const [formData, setFormData] = useState({
    pictures: {
      outdoorUnitLocation: [],
      outdoorUnitLocationWithArea: [],
      heatingRoom: [],
      meterClosetWithDoorOpen: [],
      meterClosetSlsSwitchDetailed: [],
      floorHeatingDistributionWithDoorOpen: [],
    },
  })

  const [uploadUrls, setUploadUrls] = useState({
    outdoorUnit: '',
    heatingRoom: '',
    meterCloset: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const sellingData: SellingLeadDto = {
      ...initialData,
      leadStage: 'selling',
      project: {
        ...initialData.project,
        pictures: {
          outdoorUnitLocation: uploadUrls.outdoorUnit ? [{ url: uploadUrls.outdoorUnit }] : [],
          outdoorUnitLocationWithArea: uploadUrls.outdoorUnit
            ? [{ url: uploadUrls.outdoorUnit }]
            : [],
          heatingRoom: uploadUrls.heatingRoom ? [{ url: uploadUrls.heatingRoom }] : [],
          meterClosetWithDoorOpen: uploadUrls.meterCloset ? [{ url: uploadUrls.meterCloset }] : [],
          meterClosetSlsSwitchDetailed: uploadUrls.meterCloset
            ? [{ url: uploadUrls.meterCloset }]
            : [],
          floorHeatingDistributionWithDoorOpen: [],
        },
      },
    }

    onSubmit(sellingData)
  }

  return (
    <div className={formStyles.containerLarge}>
      <h2 className={formStyles.heading}>Selling Phase - Photo Documentation</h2>

      <form onSubmit={handleSubmit} className={formStyles.formSection}>
        <div className={formStyles.formSection}>
          <div>
            <label htmlFor="outdoorUnit" className={formStyles.label}>
              Outdoor Unit Location Photo URL
            </label>
            <input
              id="outdoorUnit"
              type="url"
              required
              value={uploadUrls.outdoorUnit}
              onChange={(e) => setUploadUrls((prev) => ({ ...prev, outdoorUnit: e.target.value }))}
              placeholder="https://example.com/photo1.jpg"
              className={formStyles.input}
              disabled={isSubmitting}
            />
            <p className={formStyles.helpText}>
              Please provide a photo showing the planned outdoor unit location
            </p>
          </div>

          <div>
            <label htmlFor="heatingRoom" className={formStyles.label}>
              Heating Room Photo URL
            </label>
            <input
              id="heatingRoom"
              type="url"
              required
              value={uploadUrls.heatingRoom}
              onChange={(e) => setUploadUrls((prev) => ({ ...prev, heatingRoom: e.target.value }))}
              placeholder="https://example.com/photo2.jpg"
              className={formStyles.input}
              disabled={isSubmitting}
            />
            <p className={formStyles.helpText}>
              Please provide a photo of the current heating room/boiler room
            </p>
          </div>

          <div>
            <label htmlFor="meterCloset" className={formStyles.label}>
              Meter Closet Photo URL
            </label>
            <input
              id="meterCloset"
              type="url"
              required
              value={uploadUrls.meterCloset}
              onChange={(e) => setUploadUrls((prev) => ({ ...prev, meterCloset: e.target.value }))}
              placeholder="https://example.com/photo3.jpg"
              className={formStyles.input}
              disabled={isSubmitting}
            />
            <p className={formStyles.helpText}>
              Please provide a photo of the meter closet with the door open
            </p>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className={formStyles.buttonSuccess}>
          {isSubmitting ? 'Submitting...' : 'Complete Application'}
        </button>
      </form>
    </div>
  )
}
