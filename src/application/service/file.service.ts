import { inject, injectable } from 'inversify'
import { IFileService } from '../port/file.service.interface'
import { Identifier } from '../../di/identifiers'
import { IFileRepository } from '../port/file.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../port/query.interface'
import { SendFile } from '../domain/model/send.file'
import { File } from '../domain/model/file'
import { IntegrationEventRepository } from '../../infrastructure/repository/integration.event.repository'
import { FileSyncEvent } from '../integration-event/event/file.sync.event'
import { DeleteFiles } from '../domain/model/delete.files'


@injectable()
export class FileService implements IFileService {

    constructor(
        @inject(Identifier.FILE_REPOSITORY) private readonly _fileRepository: IFileRepository,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepositoy: IntegrationEventRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public add(item: any): Promise<any> {
        return Promise.resolve(undefined)
    }

    public downloadFile(id: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            return this._fileRepository.downloadFile(id)
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => reject(err))
        })
    }

    public uploadFile(file: any, directory_id: string): Promise<File> {
        return new Promise<File>((resolve, reject) => {
            this._fileRepository.uploadFile(file, directory_id)
                .then((result) => {
                    const files = new File().fromJSON({
                        file_name: file.name,
                        file_id: result
                    })
                    resolve(files)
                }).catch(err => {
                    reject(err)
            })
        })
    }

    public findByDirectory(directory: string): Promise<Array<any>> {
        try {
            const result = this._fileRepository.findByDirectory(directory)
            return Promise.resolve(result)
        } catch (err) {
            this._logger.error(`Error: ${err}`)
            return Promise.reject(err)
        }
    }

    public getAll(query: IQuery): Promise<Array<any>> {
        try {
            const result = this._fileRepository.find(query)
            return Promise.resolve(result)
        } catch (err) {
            this._logger.error(`Error: ${err}`)
            return Promise.reject(err)
        }
    }

    public async sendFiles(sendFile: SendFile): Promise<any> {
        try {
            const result = await this._integrationEventRepositoy.publishEvent(new FileSyncEvent(new Date(), sendFile))
            return Promise.resolve(result)
        } catch (err) {
            this._logger.error(`Error: ${err}`)
            return Promise.reject(err)
        }
    }

    public getById(id: string | number, query: IQuery): Promise<any> {
        return Promise.resolve(undefined)
    }

    public remove(id: string | number): Promise<boolean> {
        return Promise.resolve(false)
    }

    public update(item: any): Promise<any> {
        return Promise.resolve(undefined)
    }

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(0)
    }

    public async deleteFiles(files: DeleteFiles): Promise<void> {
        try {
            if (files.files_ids instanceof Array) {
                for (const file of files.files_ids) {
                    await this._fileRepository.delete(file)
                }
            }
            return Promise.resolve()
        } catch (err) {
        this._logger.error(`Error: ${err}`)
        return Promise.reject(err)
    }
    }
}
