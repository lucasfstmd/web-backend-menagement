import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IFileService } from '../../application/port/file.service.interface'
import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { unlinkSync } from 'fs'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { SendFile } from '../../application/domain/model/send.file'
import { IDirectoryService } from '../../application/port/directory.service.interface'

@controller('/v1/files')
export class FileController {

    private static handlerError(res: Response, err: any) {
        const handlerError = ApiExceptionManager.build(err)
        return res.status(handlerError.code)
            .send(handlerError.toJSON())
    }

    constructor(
        @inject(Identifier.FILE_SERVICE) private readonly _service: IFileService,
        @inject(Identifier.DIRECTORY_SERVICE) private readonly _dService: IDirectoryService,
    ) {
    }

    @httpPost('/upload/:directory_id')
    public async uploadFile(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const { directory_id } = req.params
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('Nenhum arquivo recebido')
            }
            const filesName = Object.keys(req.files)

            const uploadPromises: Promise<any>[] = []

            const files = req.files
            filesName.forEach((arq) => {
                const objFiles = files[arq]
                const uploadPromise = this._service.uploadFile(objFiles, directory_id)
                    .then((result) => {
                        return result
                    })
                    .catch((err) => FileController.handlerError(res, err))
                uploadPromises.push(uploadPromise)
            })

            const results = await Promise.all(uploadPromises)
            const fileSend = new SendFile().fromJSON({
                directory_id,
                files: results
            })
            await this._dService.uploadFiles(fileSend)
            return res.status(HttpStatus.OK).send(fileSend)

        } catch (err) {
            return FileController.handlerError(res, err)
        }
    }

    @httpGet('/download/:file_id')
    public async downloadFile(@request() req: Request, @response() res: Response): Promise<Response> {
        return new Promise((resolve, reject) => {
            try {
                const { file_id } = req.params
                this._service.downloadFile(file_id)
                    .then((filePath) => {
                        res.download(filePath, () => {
                            unlinkSync(filePath)
                            resolve(res)
                        })
                    })
                    .catch((err) => {
                        reject(err)
                    })
            } catch (err) {
                reject(err)
            }
        })
    }

    @httpGet('/find/:directory_id')
    public async getByDirectory(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const { directory_id } = req.params
            const file = await this._service.findByDirectory(directory_id)
            return res.status(HttpStatus.OK).send(file)
        } catch (err) {
            return FileController.handlerError(res, err)
        }
    }

    @httpDelete('/:file_id')
    public async deleteFile(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const { file_id } = req.params
            const file = await this._service.remove(file_id)
            return res.status(HttpStatus.OK).send(file)
        } catch (err) {
            return FileController.handlerError(res, err)
        }
    }

    @httpGet('')
    public async getAll(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result = await this._service.getAll(new Query())
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            return FileController.handlerError(res, err)
        }
    }

}
