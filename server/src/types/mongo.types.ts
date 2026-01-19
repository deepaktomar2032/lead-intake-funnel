import { ObjectId } from 'mongodb'

export interface DbEntry {
    _id?: ObjectId
    createdAt?: Date
    updatedAt?: Date
}
