/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */
export abstract class Default {
    public static readonly APP_ID: string = 'data.cross'
    public static readonly APP_TITLE: string = 'DATA CROSS API'
    public static readonly APP_DESCRIPTION: string = 'Service responsible for performing the crossing of data obtained from the informix.'
    public static readonly NODE_ENV: string = 'test' // development, test, production
    public static readonly PORT_HTTP: number = 3000
    public static readonly PORT_HTTPS: number = 3001
    public static readonly SWAGGER_PATH: string = './src/ui/swagger/swagger.yaml'
    public static readonly SWAGGER_URI: string = 'https://api.swaggerhub.com/apis/SMTC3/data-cross/v1/swagger.json'
    public static readonly LOGO_URI: string = 'https://i.imgur.com/NSbFJ02.png'

    // MongoDB
    public static readonly MONGODB_URI: string = 'mongodb+srv://SYSDBA:masterkey@cluster0.wivsc.mongodb.net/smtc'
    public static readonly MONGODB_URI_TEST: string = 'mongodb+srv://SYSDBA:masterkey@cluster0.wivsc.mongodb.net/test'

    // RabbitMQ
    public static readonly RABBITMQ_URI: string = 'amqp://guest:guest@127.0.0.1:5672'

    // Log
    public static readonly LOG_DIR: string = 'logs'

    // Certificate
    // To generate self-signed certificates, see: https://devcenter.heroku.com/articles/ssl-certificate-self
    public static readonly SSL_KEY_PATH: string = '.certs/server_key.pem'
    public static readonly SSL_CERT_PATH: string = '.certs/server_cert.pem'
}
