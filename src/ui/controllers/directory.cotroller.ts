import { controller, httpDelete, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IDirectoryService } from '../../application/port/directory.service.interface'
import HttpStatus from 'http-status-codes'
import { Directory } from '../../application/domain/model/directory'
import { Query } from '../../infrastructure/repository/query/query'

@controller('/v1/directory')
export class DirectoryCotroller {
    private static handlerError(res: Response, err: any) {
        const handlerError = ApiExceptionManager.build(err)
        return res.status(handlerError.code)
            .send(handlerError.toJSON())
    }

    constructor(
        @inject(Identifier.DIRECTORY_SERVICE) private readonly _service: IDirectoryService
    ) {
    }

    @httpPost('/create/folder/:directory_id/:directory_name')
    public async createFolder(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const { directory_id, directory_name } = req.params
            console.log(req.params)
            const result = await this._service.createFolder(directory_name, directory_id)

            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            return DirectoryCotroller.handlerError(res, err)
        }
    }

    @httpPut('/update/folder')
    public async updateFolder(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const directory: Directory = new Directory().fromJSON(req.body)

            const result = await this._service.updateFolder(directory)

            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            return DirectoryCotroller.handlerError(res, err)
        }
    }

    @httpDelete('/:directory_id')
    public async deleteFolder(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const { directory_id } = req.params
            const result = await this._service.remove(directory_id)

            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            return DirectoryCotroller.handlerError(res, err)
        }
    }

    @httpGet('/:directory_id')
    public async getDirectorys(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const { directory_id } = req.params
            const query = new Query()
            query.addFilter({
                directory: directory_id
            })
            const result = await this._service.getAll(query)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            return DirectoryCotroller.handlerError(res, err)
        }
    }
}
