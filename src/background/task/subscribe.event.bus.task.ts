import { inject, injectable } from 'inversify'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { FileSyncEvent } from '../../application/integration-event/event/file.sync.event'
import { FileSyncEventHandler } from '../../application/integration-event/handler/file.sync.event.handler'
import { DIContainer } from '../../di/di'
import { IDirectoryService } from '../../application/port/directory.service.interface'

@injectable()
export class SubscribeEventBusTask implements IBackgroundTask {

    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.subscribeEvents()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping SubscribeEventBusTask! ${err.message}`))
        }
    }

    public subscribeEvents(): void {
        this._eventBus
            .subscribe(new FileSyncEvent(), new FileSyncEventHandler(
                    DIContainer.get<IDirectoryService>(Identifier.DIRECTORY_SERVICE), this._logger),
                FileSyncEvent.ROUTING_KEY)
            .then((result: boolean) => {
                if (result) this._logger.info('Subscribe in FileSyncEvent successful!')
            })
            .catch(err => {
                this._logger.error(`Error in Subscribe FileSyncEvent! ${err.message}`)
            })
    }
}
