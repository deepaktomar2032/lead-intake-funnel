import { Module } from '@nestjs/common'

import { DatabaseModule } from 'src/database/database.module'

import { LeadAdapter } from './lead.adapter'

@Module({
    imports: [DatabaseModule],
    providers: [LeadAdapter],
    exports: [LeadAdapter]
})
export class AdapterModule {}
