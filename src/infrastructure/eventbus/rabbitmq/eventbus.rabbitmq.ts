import { amqpClient } from 'amqp-client-node'
import { inject, injectable } from 'inversify'
import { IEventBus } from '../../port/event.bus.interface'
import { IIntegrationEventHandler } from '../../../application/integration-event/handler/integration.event.handler.interface'
import { IntegrationEvent } from '../../../application/integration-event/event/integration.event'
import { Identifier } from '../../../di/identifiers'
import { IConnectionEventBus } from '../../port/connection.event.bus.interface'
import { EventBusException } from '../../../application/domain/exception/eventbus.exception'
import { Strings } from '../../../utils/strings'
import { IJSONSerializable } from '../../../application/domain/utils/json.serializable.interface'

@injectable()
export class EventBusRabbitMQ implements IEventBus {
    private readonly RABBITMQ_QUEUE_NAME: string = 'mng'
    private readonly RABBITMQ_RPC_QUEUE_NAME: string = 'mng.rpc'
    private readonly RABBITMQ_RPC_EXCHANGE_NAME: string = 'mng.rpc'
    private _receiveFromYourself: boolean
    private _event_handlers: Map<string, IIntegrationEventHandler<IntegrationEvent<IJSONSerializable>>>
    private _rpcServer!: any
    private _rpcServerInitialized: boolean

    constructor(
        @inject(Identifier.RABBITMQ_CONNECTION) public connectionPub: IConnectionEventBus,
        @inject(Identifier.RABBITMQ_CONNECTION) public connectionSub: IConnectionEventBus,
        @inject(Identifier.RABBITMQ_CONNECTION) public connectionRpcServer: IConnectionEventBus,
        @inject(Identifier.RABBITMQ_CONNECTION) public connectionRpcClient: IConnectionEventBus
    ) {
        this._event_handlers = new Map()
        this._receiveFromYourself = false
        this._rpcServerInitialized = false
    }

    set receiveFromYourself(value: boolean) {
        this._receiveFromYourself = value
    }

    /**
     * Publish in topic.
     *
     * @param event {IntegrationEvent<IJSONSerializable>}
     * @returns {Promise<boolean>}
     */
    public async publish(event: IntegrationEvent<IJSONSerializable>): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!this.connectionPub.isOpen) return reject(new EventBusException(
                Strings.ERROR_MESSAGE.EVENT_BUS.DEFAULT_MESSAGE, Strings.ERROR_MESSAGE.EVENT_BUS.NO_CONNECTION_OPEN))

            const message = { content: event.toJSON() }
            this.connectionPub
                .publish(event.type, event.routing_key, message, {
                    exchange: {
                        type: 'topic',
                        durable: true
                    }
                })
                .then(() => resolve(true))
                .catch(reject)
        })
    }

    /**
     * Subscribe in topic.
     *
     * @param event {IntegrationEvent<IJSONSerializable>}
     * @param handler {IIntegrationEventHandler<IntegrationEvent<IJSONSerializable>>}
     * @returns {Promise<boolean>}
     */
    public async subscribe(event: IntegrationEvent<IJSONSerializable>,
                           handler: IIntegrationEventHandler<IntegrationEvent<IJSONSerializable>>): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!this.connectionSub.isOpen) return reject(new EventBusException(
                Strings.ERROR_MESSAGE.EVENT_BUS.DEFAULT_MESSAGE, Strings.ERROR_MESSAGE.EVENT_BUS.NO_CONNECTION_OPEN))
            if (this._event_handlers.has(event.event_name)) return resolve(true)

            this._event_handlers.set(event.event_name, handler)
            this.connectionSub
                .subscribe(this.RABBITMQ_QUEUE_NAME, event.type, event.routing_key, (message) => {
                    message.ack()

                    const event_name: string = message.content.event_name
                    if (event_name) {
                        const event_handler: IIntegrationEventHandler<IntegrationEvent<IJSONSerializable>> | undefined =
                            this._event_handlers.get(event_name)
                        if (event_handler) event_handler.handle(message.content)
                    }
                }, {
                    exchange: {
                        type: 'topic',
                        durable: true
                    }, queue: {
                        durable: true
                    },
                    consumer: {
                        noAck: false
                    },
                    receiveFromYourself: this._receiveFromYourself
                })
                .then(() => {
                    resolve(true)
                })
                .catch(reject)
        })
    }

    public provideResource(name: string, resource: (...any) => any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!this.connectionRpcServer.isOpen) return reject(new EventBusException(
                Strings.ERROR_MESSAGE.EVENT_BUS.DEFAULT_MESSAGE, Strings.ERROR_MESSAGE.EVENT_BUS.NO_CONNECTION_OPEN))

            this.initializeRPCServer()
            this._rpcServer.addResource(name, resource)

            this._rpcServer
                .start()
                .then(() => resolve(true))
                .catch(reject)
        })
    }

    public executeResource(serviceName: string, resourceName: string, ...params: any[]): Promise<any> {
        if (!this.connectionRpcClient.isOpen) return Promise.reject(new EventBusException(
            Strings.ERROR_MESSAGE.EVENT_BUS.DEFAULT_MESSAGE, Strings.ERROR_MESSAGE.EVENT_BUS.NO_CONNECTION_OPEN))

        return this.connectionRpcClient
            .rpcClient(
                serviceName,
                resourceName,
                params,
                {
                    exchange: {
                        type: 'direct',
                        durable: true
                    },
                    rpcTimeout: 5000
                })
    }

    private initializeRPCServer(): void {
        if (!this._rpcServerInitialized) {
            this._rpcServerInitialized = true
            this._rpcServer = this.connectionRpcServer
                .createRpcServer(
                    this.RABBITMQ_RPC_QUEUE_NAME,
                    this.RABBITMQ_RPC_EXCHANGE_NAME,
                    [],
                    {
                        exchange: {
                            type: 'direct',
                            durable: true
                        }, queue: {
                            expires: 5000
                        }
                    })
        }
    }

    /**
     * Releases the resources.
     *
     * @returns {Promise<void>}
     */
    public async dispose(): Promise<void> {
        if (this.connectionPub) await this.connectionPub.close()
        if (this.connectionSub) await this.connectionSub.close()
        if (this.connectionRpcServer) await this.connectionRpcServer.close()
        if (this.connectionRpcClient) await this.connectionRpcClient.close()
        this._event_handlers.clear()
        return Promise.resolve()
    }

    public enableLogger(level?: string): void {
        amqpClient.logger(!level ? 'warn' : level)
    }
}
