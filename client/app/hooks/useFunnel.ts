import type {
  DiscoveryLeadDto,
  LeadRequestDto,
  LeadResponseDto,
  LeadStage,
  MinimalLeadDto,
  QualificationLeadDto,
  SellingLeadDto,
} from 'heatos-shared'
import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export interface MinimalData extends Omit<MinimalLeadDto, 'leadStage'> {}
export interface QualificationData extends Omit<QualificationLeadDto, 'leadStage'> {}
export interface DiscoveryData extends Omit<DiscoveryLeadDto, 'leadStage'> {}
export interface SellingData extends Omit<SellingLeadDto, 'leadStage'> {}

export type FunnelData = MinimalData | QualificationData | DiscoveryData | SellingData

export interface FunnelState {
  stage: LeadStage
  data: FunnelData
  isSubmitting: boolean
}

const createInitialMinimalData = (): MinimalData => ({
  version: '1.2.0',
  contact: {
    contactInformation: {
      firstName: '',
      lastName: '',
      phone: '+49',
      email: '',
    },
  },
})

export function useFunnel() {
  const [state, setState] = useState<FunnelState>({
    stage: 'minimal',
    data: createInitialMinimalData(),
    isSubmitting: false,
  })

  const updateData = <T extends FunnelData>(newData: T, newStage?: LeadStage) => {
    setState((prev) => ({
      ...prev,
      stage: newStage || prev.stage,
      data: newData,
    }))
  }

  const loadExistingLead = (existingData: any, targetStage: LeadStage) => {
    setState((prev) => ({
      ...prev,
      stage: targetStage,
      data: existingData,
      isSubmitting: false,
    }))
  }

  const submitData = async (dataToSubmit?: FunnelData): Promise<LeadResponseDto> => {
    setState((prev) => ({ ...prev, isSubmitting: true }))

    const currentData = dataToSubmit || state.data

    try {
      const url = state.stage === 'minimal' ? `${API_BASE}/lead` : `${API_BASE}/lead`
      const method = state.stage === 'minimal' ? 'POST' : 'PUT'

      const requestData: LeadRequestDto = {
        ...currentData,
        leadStage: state.stage,
      } as LeadRequestDto

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: LeadResponseDto = await response.json()

      const stageOrder: LeadStage[] = ['minimal', 'qualification', 'discovery', 'selling']
      const currentIndex = stageOrder.indexOf(state.stage)
      const nextStage = stageOrder[currentIndex + 1]

      if (nextStage) {
        setState((prev) => ({
          ...prev,
          stage: nextStage,
          isSubmitting: false,
        }))
      } else {
        setState((prev) => ({ ...prev, isSubmitting: false }))
      }

      return result
    } catch (error) {
      setState((prev) => ({ ...prev, isSubmitting: false }))
      throw error
    }
  }

  return {
    ...state,
    updateData,
    submitData,
    loadExistingLead,
  }
}
