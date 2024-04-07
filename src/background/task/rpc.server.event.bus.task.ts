import { IBackgroundTask } from '../../application/port/background.task.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { IDirectoryService } from '../../application/port/directory.service.interface'
import { ILogger } from '../../utils/custom.logger'

@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.DIRECTORY_SERVICE) private readonly _directoryService: IDirectoryService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.initializeServer()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping RPC Server! ${err.message}`))
        }
    }

    private initializeServer(): void {
        this._eventBus
            .provideResource('delete.sync', async (sendFile?: any) => {
                try {
                    const result = await this._directoryService.uploadFiles(sendFile)
                    return result?.toJSON()
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource filesSync successful registered'))
            .catch((err) => this._logger.error(`Error at register resource filesSync: ${err.message}`))
    }
}
