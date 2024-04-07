import { IDisposable } from './disposable.interface'
import { EventEmitter } from 'events'
import { IDBOptions } from './connection.factory.interface'

export interface IConnectionDB extends IDisposable {
    connection: any
    eventConnection: EventEmitter

    tryConnect(uri: string, options?: IDBOptions): Promise<void>
}
