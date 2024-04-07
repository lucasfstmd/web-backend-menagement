import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { FileSyncEvent } from '../event/file.sync.event'
import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { ILogger } from '../../../utils/custom.logger'
import { IDirectoryService } from '../../port/directory.service.interface'
import { SendFile } from '../../domain/model/send.file'

export class FileSyncEventHandler implements IIntegrationEventHandler<FileSyncEvent> {

    constructor(
        @inject(Identifier.DIRECTORY_SERVICE) public readonly _directoryService: IDirectoryService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: FileSyncEvent): Promise<void> {
        try {
            if (!event.files?.files?.length) {
                this._logger.error('Array is empty')
            }
            if (event.files instanceof SendFile) {
                console.log(event.files)
                await this._directoryService.uploadFiles(event.files)
                this._logger.info(`Action for event ${event.event_name} executed successfully!`)
            }
        } catch (err: any) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`to perform the operation with the event: ${JSON.stringify(event)}. Error: ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
