import { injectable } from 'inversify'
import { IConnectionFactory, IDBOptions } from '../port/connection.factory.interface'
import mongoose, { Connection, Mongoose } from 'mongoose'

@injectable()
export class ConnectionFactoryMongodb implements IConnectionFactory {
    /**
     * Create instance of MongoDB.
     *
     * @param uri This specification defines an URI scheme.
     * For more details see: {@link https://docs.mongodb.com/manual/reference/connection-string/}
     * @param options {IDBOptions} Connection setup Options.
     * @return Promise<Connection>
     */

    public createConnection(uri: string, options?: IDBOptions): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
            mongoose.set('strictQuery', false)
            mongoose.connect(uri, options)
                .then((result: Mongoose) => resolve(result.connection))
                .catch(err => reject(err))
        })
    }
}
