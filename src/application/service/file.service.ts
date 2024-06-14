import { inject, injectable } from 'inversify'
import { IFileService } from '../port/file.service.interface'
import { Identifier } from '../../di/identifiers'
import { IFileRepository } from '../port/file.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../port/query.interface'
import { File } from '../domain/model/file'

@injectable()
export class FileService implements IFileService {

    constructor(
        @inject(Identifier.FILE_REPOSITORY) private readonly _fileRepository: IFileRepository,
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

    public getById(id: string | number, query: IQuery): Promise<any> {
        return Promise.resolve(undefined)
    }

    public async remove(id: string): Promise<boolean> {
        try {
            const result = this._fileRepository.delete(id)
            console.log(result)
            return Promise.resolve(result)
        } catch (err) {
            this._logger.error(`Error: ${err}`)
            return Promise.reject(err)
        }
    }

    public update(item: any): Promise<any> {
        return Promise.resolve(undefined)
    }

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(0)
    }

    public async deleteFiles(directory_id: string): Promise<void> {
        try {
            const files = await this._fileRepository.findByDirectory(directory_id)
            for (const file of files) {
                await this._fileRepository.delete(file._id)
            }
        } catch (err) {
            this._logger.error(`Error: ${err}`)
            return Promise.reject(err)
        }
    }
}
