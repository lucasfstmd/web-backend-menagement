import { IService } from './service.interface'
import { File } from '../domain/model/file'

export interface IFileService extends IService<any> {

    uploadFile(file: any, directory_id: string): Promise<File>

    downloadFile(id: string): Promise<string>

    findByDirectory(directory: string): Promise<Array<any>>

    deleteFiles(directory_id: string): Promise<void>
}
