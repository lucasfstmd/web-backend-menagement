import { ObjectId } from 'mongodb'
import { IRepository } from './repository.interface'

export interface IFileRepository extends IRepository<any> {

    uploadFile(file: any, directory_id: string): Promise<ObjectId>

    downloadFile(id: string): Promise<string>

    findByDirectory(directory: string): Promise<Array<any>>
}
