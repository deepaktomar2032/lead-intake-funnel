import { Body, Controller, HttpCode, HttpStatus, Inject, NotFoundException, Post, Put } from '@nestjs/common'
import { type LeadRequestDto, LeadRequestSchema, type LeadResponseDto } from 'heatos-shared'

import { LeadAdapter } from 'src/adapters/lead.adapter'
import { LeadEntry } from 'src/types/leadEntry.types'

import { LeadService } from './lead.service'
import { ZodValidationPipe } from './pipes/validation.pipe'

@Controller('lead')
export class LeadController {
    @Inject() private readonly leadAdapter: LeadAdapter<LeadEntry>
    @Inject() private readonly leadService: LeadService

    @Post()
    @HttpCode(HttpStatus.OK)
    async createLead(@Body(new ZodValidationPipe(LeadRequestSchema)) body: LeadRequestDto): Promise<LeadResponseDto> {
        const { email, phone } = body.contact.contactInformation

        const existingLeadEntry: LeadEntry | undefined = await this.leadAdapter.findOne({
            'contact.contactInformation.email': email,
            'contact.contactInformation.phone': phone
        })

        if (!existingLeadEntry) return await this.leadService.insertLead(body)

        return {
            leadStage: existingLeadEntry.leadStage,
            dataAcquisitionLink: 'https://www.vamo-energy.com/rechner...',
            appointmentBookingLink: null,
            existingData: existingLeadEntry
        }
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    async updateExistingLead(
        @Body(new ZodValidationPipe(LeadRequestSchema)) body: LeadRequestDto
    ): Promise<LeadResponseDto> {
        const { email, phone } = body.contact.contactInformation

        const existingLeadEntry: LeadEntry | undefined = await this.leadAdapter.findOne({
            'contact.contactInformation.email': email,
            'contact.contactInformation.phone': phone
        })

        if (!existingLeadEntry) throw new NotFoundException('Lead entry does not exist for upsert')

        return await this.leadService.upsertLead(body)
    }
}
