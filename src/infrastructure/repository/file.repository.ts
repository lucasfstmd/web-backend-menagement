import { IFileRepository } from '../../application/port/file.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { ObjectValidation } from '../../application/domain/validator/object.validation'
import { join } from 'path'
import {
    existsSync,
    mkdirSync,
    writeFileSync,
    createReadStream,
    unlinkSync,
    createWriteStream
} from 'fs'
import { Strings } from '../../utils/Strings'
import { IQuery } from '../../application/port/query.interface'
import { IConnectionDB } from '../port/connection.db.interface'
import { GridFSBucket, ObjectId } from 'mongodb'

@injectable()
export class FileRepository implements IFileRepository {
    private _filePaths: string

    constructor(
        @inject(Identifier.MONGODB_CONNECTION) private readonly _connection: IConnectionDB,
    ) {
        this._filePaths =  'C:/Users/NUTES/WebstormProjects/caderneta/web-backend-menagement/temp-files'
        if (!existsSync(this._filePaths)) {
            mkdirSync(this._filePaths)
        }
    }

    public checkExists(item: any): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    private _initializeBucket(): GridFSBucket {
        return new GridFSBucket(this._connection.connection.db, {
            bucketName: ''
        })
    }

    public uploadFile(file: any, directory_id: string): Promise<ObjectId> {
        return new Promise((resolve, reject) => {
            if (ObjectValidation.isValidObject(file)) {
                const bucket = this._initializeBucket()
                const fileName = file.name
                const fileData = file.data
                const temporaryFileName = `${fileName}-${(new Date().getTime())}`

                const pathFileTemp = join(this._filePaths, temporaryFileName)
                writeFileSync(pathFileTemp, fileData)

                const streamGridFS = bucket.openUploadStream(fileName, {
                    metadata: {
                        mimetype: file.mimetype,
                        directory: directory_id
                    }
                })

                const readStream = createReadStream(pathFileTemp)
                readStream
                    .pipe(streamGridFS)
                    .on('finish', () => {
                        unlinkSync(pathFileTemp)
                        resolve(new ObjectId(`${streamGridFS.id}`))
                    })
                    .on('error', err => {
                        reject(Strings.NAO_FOI_POSSIVEL_GRAVAR)
                    })
            } else {
                reject(Strings.OBJETO_ARQUIVO_INVALIDO)
            }
        })
    }

    public downloadFile(id: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (id && id.length === 24) {
                const _id = new ObjectId(id)
                const bucket = this._initializeBucket()
                const results = await bucket.find({ '_id': _id }).toArray()
                if (results.length > 0) {
                    const metadata = results[0]
                    const streamGridFS = bucket.openDownloadStream(_id)
                    const filePath = join(this._filePaths, metadata.filename)
                    const stramRecord = createWriteStream(filePath)
                    streamGridFS
                        .pipe(stramRecord)
                        .on('finish', () => {
                            resolve(filePath)
                        })
                        .on('error', err => {
                            reject(Strings.NAO_FOI_POSSIVEL_GRAVAR)
                        })
                } else {
                    reject(Strings.NENHUM_ARQUIVO_ENCONTRADO)
                }
            } else {
                reject(Strings.ID_INVALIDO)
            }
        })
    }

    public findByDirectory(directory: string): Promise<Array<File>> {
        try {
            const result = this._initializeBucket().find({ 'metadata.directory': `${directory}` }).toArray()
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(query: IQuery): Promise<number> {
        try {
            const result = this._initializeBucket().find({  }).count()
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public create(item: any): Promise<any> {
        return Promise.resolve(undefined)
    }

    public delete(id: string | number): Promise<boolean> {
        try {
            this._initializeBucket().delete({'_id': id},  (err) => {
                return !err
            })
            return Promise.resolve(true)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public find(query: IQuery): Promise<Array<any>> {
        try {
            const result = this._initializeBucket().find({  }).toArray()
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public findOne(query: IQuery): Promise<any> {
        return Promise.resolve(undefined)
    }

    public update(item: any): Promise<any> {
        return Promise.resolve(undefined)
    }
}
