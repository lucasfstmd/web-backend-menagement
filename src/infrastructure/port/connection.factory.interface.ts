export interface IConnectionFactory {
    createConnection(uri: string, options?: IDBOptions | IEventBusOptions): Promise<any>
}

export interface IDBOptions {
    tlsAllowInvalidCertificates: boolean
    tlsCAFile: any
    tlsCertificateKeyFile: any
    tlsCertificateFile: any
    useUnifiedTopology: boolean
    executeLegacyOperation: boolean
}

export interface IEventBusOptions {
    retries?: number
    interval?: number
    sslOptions?: ISSL
}

export interface ISSL {
    cert?: Buffer
    key?: Buffer
    ca?: Buffer[]
}
