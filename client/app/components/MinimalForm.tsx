import type { ContactInformationDto } from 'heatos-shared'
import React, { useState } from 'react'

import { formStyles } from '../styles/formStyles'

interface MinimalFormProps {
  initialData: Partial<ContactInformationDto>
  onSubmit: (data: ContactInformationDto) => void
  isSubmitting: boolean
  disabled?: boolean
}

export function MinimalForm({
  initialData,
  onSubmit,
  isSubmitting,
  disabled = false,
}: MinimalFormProps) {
  const [formData, setFormData] = useState<ContactInformationDto>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    phone: initialData.phone || '+49',
    email: initialData.email || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof ContactInformationDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={formStyles.container}>
      <h2 className={formStyles.heading}>Contact Information</h2>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <div>
          <label htmlFor="firstName" className={formStyles.label}>
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={formStyles.inputDisabled}
            disabled={isSubmitting || disabled}
          />
        </div>

        <div>
          <label htmlFor="lastName" className={formStyles.label}>
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={formStyles.inputDisabled}
            disabled={isSubmitting || disabled}
          />
        </div>

        <div>
          <label htmlFor="phone" className={formStyles.label}>
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+49..."
            className={`${formStyles.inputWithPlaceholder} disabled:bg-gray-100 disabled:cursor-not-allowed`}
            disabled={isSubmitting || disabled}
          />
        </div>

        <div>
          <label htmlFor="email" className={formStyles.label}>
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={formStyles.inputDisabled}
            disabled={isSubmitting || disabled}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={formStyles.button}>
          {isSubmitting ? 'Saving...' : 'Save & Next'}
        </button>
      </form>
    </div>
  )
}
