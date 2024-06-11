import 'reflect-metadata'
import { Container } from 'inversify'
import { Identifier } from './identifiers'
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { BackgroundService } from '../background/background.service'

import { App } from '../app'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { ConnectionFactoryRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { IConnectionEventBus } from '../infrastructure/port/connection.event.bus.interface'
import { ConnectionRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { EventBusRabbitMQ } from '../infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IntegrationEventRepository } from '../infrastructure/repository/integration.event.repository'
import { IIntegrationEventRepository } from '../application/port/integration.event.repository.interface'
import { IntegrationEventRepoModel } from '../infrastructure/database/schema/integration.event.schema'
import { PublishEventBusTask } from '../background/task/publish.event.bus.task'
import { DirectoryRepoModel } from '../infrastructure/database/schema/directory.schema'
import { Directory } from '../application/domain/model/directory'
import { DirectoryEntity } from '../infrastructure/database/entity/directory.entity'
import { DirectoryMapper } from '../infrastructure/database/entity/mapper/directory.mapper'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { IDirectoryRepository } from '../application/port/directory.repository.interface'
import { DirectoryRepository } from '../infrastructure/repository/directory.repository'
import { DirectoryCotroller } from '../ui/controllers/directory.cotroller'
import { IDirectoryService } from '../application/port/directory.service.interface'
import { DirectoryService } from '../application/service/directory.service'
import { SubscribeEventBusTask } from '../background/task/subscribe.event.bus.task'
import { RpcServerEventBusTask } from '../background/task/rpc.server.event.bus.task'
import { FileController } from '../ui/controllers/file.controller'
import { FileRepository } from '../infrastructure/repository/file.repository'
import { IFileRepository } from '../application/port/file.repository.interface'
import { FileService } from '../application/service/file.service'
import { IFileService } from '../application/port/file.service.interface'

class IoC {
    private readonly _container: Container

    /**
     * Creates an instance of Di.
     * @private
     */
    constructor() {
        this._container = new Container()
        this.initDependencies()
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    get container(): Container {
        return this._container
    }

    /**
     * Initializes injectable containers.
     *
     * @private
     * @return void
     */
    private initDependencies(): void {
        this._container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this._container
            .bind<DirectoryCotroller>(Identifier.DIRECTORY_CONTROLLER)
            .to(DirectoryCotroller).inSingletonScope()
        this._container
            .bind<FileController>(Identifier.FILE_CONTROLLER)
            .to(FileController).inSingletonScope()

        // Service
        this._container
            .bind<IDirectoryService>(Identifier.DIRECTORY_SERVICE)
            .to(DirectoryService).inSingletonScope()
        this._container
            .bind<IFileService>(Identifier.FILE_SERVICE)
            .to(FileService).inSingletonScope()

        // Repository
        this._container
            .bind<IIntegrationEventRepository>(Identifier.INTEGRATION_EVENT_REPOSITORY)
            .to(IntegrationEventRepository).inSingletonScope()
        this._container
            .bind<IDirectoryRepository>(Identifier.DIRECTORY_REPOSITORY)
            .to(DirectoryRepository).inSingletonScope()
        this._container
            .bind<IFileRepository>(Identifier.FILE_REPOSITORY)
            .to(FileRepository).inSingletonScope()

        // Models
        this._container.bind(Identifier.INTEGRATION_EVENT_REPO_MODEL).toConstantValue(IntegrationEventRepoModel)
        this._container.bind(Identifier.DIRECTORY_REPO_MODEL).toConstantValue(DirectoryRepoModel)

        // Service

        // Mapper
        this._container
            .bind<IEntityMapper<Directory, DirectoryEntity>>(Identifier.DIRECTORY_MAPPER)
            .to(DirectoryMapper).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()
        this._container
            .bind<IConnectionFactory>(Identifier.RABBITMQ_CONNECTION_FACTORY)
            .to(ConnectionFactoryRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionEventBus>(Identifier.RABBITMQ_CONNECTION)
            .to(ConnectionRabbitMQ)
        this._container
            .bind<IEventBus>(Identifier.RABBITMQ_EVENT_BUS)
            .to(EventBusRabbitMQ).inSingletonScope()

        // Tasks
        this._container
            .bind<IBackgroundTask>(Identifier.PUBLISH_EVENT_BUS_TASK)
            .to(PublishEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
            .to(SubscribeEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.RPC_SERVER_EVENT_BUS_TASK)
            .to(RpcServerEventBusTask).inRequestScope()

        // Log
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
