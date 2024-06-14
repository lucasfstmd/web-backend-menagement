import { IService } from './service.interface'
import { Directory } from '../domain/model/directory'
import { SendFile } from '../domain/model/send.file'

export interface IDirectoryService extends IService<Directory> {
    createFolder(name: string, directory_id: string): Promise<Directory | undefined>

    updateFolder(item: Directory): Promise<Directory | undefined>

    uploadFiles(files: SendFile): Promise<Directory | undefined>
}
