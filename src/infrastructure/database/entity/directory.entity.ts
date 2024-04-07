import { Entity } from './entity'
import { TypeDrive } from '../../../application/domain/utils/enum'

export class DirectoryEntity extends Entity {
    public type?: TypeDrive
    public name?: string
    public directory?: string
    public files?: any
}
