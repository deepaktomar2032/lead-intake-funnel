import { Module } from '@nestjs/common'

import { AdapterModule } from 'src/adapters/adapter.module'

import { LeadController } from './lead.controller'
import { LeadService } from './lead.service'

@Module({
    imports: [AdapterModule],
    controllers: [LeadController],
    providers: [LeadService]
})
export class LeadModule {}
