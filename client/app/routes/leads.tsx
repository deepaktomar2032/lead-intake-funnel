import type {
  ContactInformationDto,
  DiscoveryLeadDto,
  LeadResponseDto,
  QualificationLeadDto,
  SellingLeadDto,
} from 'heatos-shared'
import { useState } from 'react'

import { DiscoveryForm } from '../components/DiscoveryForm'
import { MinimalForm } from '../components/MinimalForm'
import { QualificationForm } from '../components/QualificationForm'
import { SellingForm } from '../components/SellingForm'
import type { MinimalData } from '../hooks/useFunnel'
import { useFunnel } from '../hooks/useFunnel'
import type { Route } from './+types/leads'

type LeadStage = 'minimal' | 'qualification' | 'discovery' | 'selling'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Heat Pump Application' },
    { name: 'description', content: 'Complete your heat pump application' },
  ]
}

export const clientLoader = async () => {
  return null
}

export default function Leads() {
  const { stage, data, isSubmitting, updateData, submitData, loadExistingLead } = useFunnel()
  const [response, setResponse] = useState<LeadResponseDto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isReturningUser, setIsReturningUser] = useState(false)

  const handleMinimalSubmit = async (contactData: ContactInformationDto) => {
    try {
      setError(null)
      const minimalData: MinimalData = {
        version: '1.2.0',
        contact: {
          contactInformation: contactData,
        },
      }
      updateData(minimalData)
      const result = await submitData(minimalData)

      if (result.existingData && result.leadStage !== 'minimal') {
        setIsReturningUser(true)
        const nextStageMap: Record<string, LeadStage> = {
          minimal: 'qualification',
          qualification: 'discovery',
          discovery: 'selling',
          selling: 'selling',
        }
        const targetStage = nextStageMap[result.leadStage] || 'qualification'
        loadExistingLead(result.existingData, targetStage)
      }

      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleQualificationSubmit = async (qualificationData: QualificationLeadDto) => {
    try {
      setError(null)
      updateData(qualificationData, 'qualification')
      const result = await submitData(qualificationData)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDiscoverySubmit = async (discoveryData: DiscoveryLeadDto) => {
    try {
      setError(null)
      updateData(discoveryData, 'discovery')
      const result = await submitData(discoveryData)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleSellingSubmit = async (sellingData: SellingLeadDto) => {
    try {
      setError(null)
      updateData(sellingData, 'selling')
      const result = await submitData(sellingData)
      setResponse(result)
      setIsComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const renderForm = () => {
    if (isComplete && stage === 'selling') {
      return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Registration Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for completing your heat pump application. Our team will review your
              information and contact you soon.
            </p>
            {response?.appointmentBookingLink && (
              <a
                href={response.appointmentBookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Book Appointment →
              </a>
            )}
          </div>
        </div>
      )
    }

    switch (stage) {
      case 'minimal':
        return (
          <MinimalForm
            initialData={(data as MinimalData).contact.contactInformation}
            onSubmit={handleMinimalSubmit}
            isSubmitting={isSubmitting}
            disabled={isReturningUser}
          />
        )

      case 'qualification':
        return (
          <QualificationForm
            initialData={data as MinimalData}
            onSubmit={handleQualificationSubmit}
            isSubmitting={isSubmitting}
          />
        )

      case 'discovery':
        return (
          <DiscoveryForm
            initialData={data as QualificationLeadDto}
            onSubmit={handleDiscoverySubmit}
            isSubmitting={isSubmitting}
          />
        )

      case 'selling':
        return (
          <SellingForm
            initialData={data as DiscoveryLeadDto}
            onSubmit={handleSellingSubmit}
            isSubmitting={isSubmitting}
          />
        )

      default:
        return (
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Application Complete!</h2>
            <p className="text-gray-600">
              Thank you for completing your heat pump application. Our team will review your
              information and contact you soon.
            </p>
          </div>
        )
    }
  }

  const getStageNumber = (currentStage: string) => {
    const stages = ['minimal', 'qualification', 'discovery', 'selling']
    return stages.indexOf(currentStage) + 1
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['minimal', 'qualification', 'discovery', 'selling'].map((stageName, index) => {
              const stepNumber = index + 1
              const currentStepNumber = getStageNumber(stage)
              const isActive = stepNumber === currentStepNumber
              const isCompleted =
                stepNumber < currentStepNumber || (isComplete && stage === 'selling')

              return (
                <div key={stageName} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? '✓' : stepNumber}
                  </div>
                  <div className="ml-3 text-sm font-medium text-gray-900 capitalize">
                    {stageName}
                  </div>
                  {index < 3 && (
                    <div className="ml-4 w-8 h-0.5 bg-gray-200">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-600 w-full' : 'bg-gray-200 w-0'
                        }`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Success message - only show if not complete */}
        {response && !isComplete && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-1 text-sm text-green-700">Stage completed successfully!</div>
              </div>
            </div>
          </div>
        )}

        {/* Form content */}
        {renderForm()}
      </div>
    </div>
  )
}
