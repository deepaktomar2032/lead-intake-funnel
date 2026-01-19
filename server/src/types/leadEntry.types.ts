import { DiscoveryLeadDto, MinimalLeadDto, QualificationLeadDto, SellingLeadDto } from 'heatos-shared'

import { DbEntry } from './mongo.types'

export type LeadEntry =
    | (DbEntry & MinimalLeadDto)
    | (DbEntry & QualificationLeadDto)
    | (DbEntry & DiscoveryLeadDto)
    | (DbEntry & SellingLeadDto)
