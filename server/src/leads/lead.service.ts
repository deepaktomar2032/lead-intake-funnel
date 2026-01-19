import { Inject, Injectable } from '@nestjs/common'
import { LeadRequestDto, LeadResponseDto } from 'heatos-shared'

import { LeadAdapter } from 'src/adapters/lead.adapter'
import { LeadEntry } from 'src/types/leadEntry.types'

@Injectable()
export class LeadService {
    @Inject() private readonly leadAdapter: LeadAdapter<LeadEntry>

    async insertLead(leadInput: LeadRequestDto): Promise<LeadResponseDto> {
        await this.leadAdapter.insertOne(leadInput)

        return this.buildLeadResponse(leadInput.leadStage)
    }

    async upsertLead(leadInput: LeadRequestDto): Promise<LeadResponseDto> {
        const { email, phone } = leadInput.contact.contactInformation

        const contactQuery = {
            'contact.contactInformation.email': email,
            'contact.contactInformation.phone': phone
        }

        await this.leadAdapter.upsertEntry(contactQuery, leadInput)

        return this.buildLeadResponse(leadInput.leadStage)
    }

    private buildLeadResponse(stage: LeadRequestDto['leadStage']): LeadResponseDto {
        switch (stage) {
            case 'selling':
                return {
                    leadStage: 'selling',
                    dataAcquisitionLink: null,
                    appointmentBookingLink: 'https://www.vamo-energy.com/appointment-booking-link...'
                }
            case 'discovery':
                return {
                    leadStage: 'discovery',
                    dataAcquisitionLink: 'https://www.vamo-energy.com/digi-vot-fotos...',
                    appointmentBookingLink: null
                }
            case 'qualification':
                return {
                    leadStage: 'qualification',
                    dataAcquisitionLink: 'https://www.vamo-energy.com/digi-vot...',
                    appointmentBookingLink: null
                }
            case 'minimal':
            default:
                return {
                    leadStage: 'minimal',
                    dataAcquisitionLink: 'https://www.vamo-energy.com/rechner...',
                    appointmentBookingLink: null
                }
        }
    }
}
