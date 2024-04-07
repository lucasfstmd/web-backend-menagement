import { inject, injectable } from 'inversify'
import { IJSONSerializable } from '../../application/domain/utils/json.serializable.interface'
import { IntegrationEvent } from '../../application/integration-event/event/integration.event'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { IIntegrationEventRepository } from '../../application/port/integration.event.repository.interface'
import { IQuery } from '../../application/port/query.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { ILogger } from '../../utils/custom.logger'

@injectable()
export class PublishEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY)
        private readonly _integrationEventRepository: IIntegrationEventRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this._internalPublishSavedEvents().then()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping PublishEventBusTask! ${err.message}`))
        }
    }

    private async _internalPublishSavedEvents(): Promise<void> {
        if (!this._eventBus.connectionPub.isOpen) return

        try {
            const query: IQuery = new Query().fromJSON({ pagination: { limit: Number.MAX_SAFE_INTEGER } })
            const result: Array<IntegrationEvent<IJSONSerializable>> = await this._integrationEventRepository.find(query)
            result.forEach((event: IntegrationEvent<IJSONSerializable>) => {
                console.log(event)
                this._eventBus.publish(event)
                    .then(success => {
                        if (success) {
                            this._logger.info(`Event with name ${event.event_name}, which was saved, `
                                .concat('was successfully published to the event bus.'))
                            this._integrationEventRepository
                                .delete(event.id!)
                                .catch(err => {
                                    this._logger.error(`Error trying to remove saved event: ${err.message}`)
                                })
                        }
                    })
                    .catch(() => {
                        this._logger.error('An error occurred while trying to publish the '
                            .concat(`event saved with name ${event.event_name} and ID ${event.id}.`))
                    })
            })
        } catch (err: any) {
            this._logger.error(`Error retrieving saved events: ${err.message}`)
        }
    }
}
