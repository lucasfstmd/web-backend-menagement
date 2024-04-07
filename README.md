# Data Cross

Service responsible for performing the crossing of data obtained from the informix system.

**Main features:**

## Prerequisites

- [Node 14.16.0+](https://nodejs.org/en/download/)
- [MongoDB Server 5.0.2+](https://www.mongodb.com/download-center/community)

---

## Set the environment variables

Application settings are defined by environment variables.. To define the settings, make a copy of the `.env.example`
file, naming for `.env`. After that, open and edit the settings as needed. The following environments variables are
available:

| VARIABLE | DESCRIPTION  | DEFAULT |
|-----|-----|-----|
| `NODE_ENV` | Defines the environment in which the application runs. You can set: `test` _(in this environment, the database defined in `MONGODB_URI_TEST` is used and the logs are disabled for better visualization of the test output)_, `development` _(in this environment, all log levels are enabled)_ and `production` _(in this environment, only the warning and error logs are enabled)_. | `development` |
| `PORT_HTTP` | Port used to listen for HTTP requests. Any request received on this port is redirected to the HTTPS port. | `3000` |
| `PORT_HTTPS` | Port used to listen for HTTPS requests. Do not forget to provide the private key and the SSL/TLS certificate. See the topic [generate certificates](#generate-certificates). | `3001` |
| `SSL_KEY_PATH` | SSL/TLS certificate private key. | `./.certs/server_key.pem` |
| `SSL_CERT_PATH` | SSL/TLS certificate. | `./.certs/server_cert.pem` |
| `MONGODB_URI` | Database connection URI used if the application is running in development or production environment. The [URI specifications ](https://docs.mongodb.com/manual/reference/connection-string) defined by MongoDB are accepted. For example: `mongodb://user:pass@host:port/database?options`. | `mongodb://127.0.0.1:27017`<br/>`/data-cross` |
| `MONGODB_URI_TEST` | Database connection URI used if the application is running in test environment. The [URI specifications ](https://docs.mongodb.com/manual/reference/connection-string) defined by MongoDB are accepted. For example: `mongodb://user:pass@host:port/database?options`. | `mongodb://127.0.0.1:27017`<br/>`/data-cross-test` |

## Generate Certificates

For development and testing environments the easiest and fastest way is to generate your own self-signed certificates.
These certificates can be used to encrypt data as well as certificates signed by a CA, but users will receive a warning
that the certificate is not trusted for their computer or browser. Therefore, self-signed certificates should only be
used in non-production environments, that is, development and testing environments. To do this, run
the `create-self-signed-certs.sh` script in the root of the repository.

```sh
chmod +x ./create-self-signed-certs.sh
```

```sh
./create-self-signed-certs.sh
```

The following files will be created: `ca.crt`, `jwt.key`, `jwt.key.pub`, `server.crt` and `server.key`.

In production environments its highly recommended to always use valid certificates and provided by a certificate
authority (CA). A good option is [Let's Encrypt](https://letsencrypt.org)  which is a CA that provides free
certificates. The service is provided by the Internet Security Research Group (ISRG). The process to obtain the
certificate is extremely simple, as it is only required to provide a valid domain and prove control over it. With Let's
Encrypt, you do this by using [software](https://certbot.eff.org/) that uses the ACME protocol, which typically runs on
your host. If you prefer, you can use the service provided by the [SSL For Free](https://www.sslforfree.com/)  website
and follow the walkthrough. The service is free because the certificates are provided by Let's Encrypt, and it makes the
process of obtaining the certificates less painful.

## Installation and Execution

#### 1. Install dependencies

```sh  
npm install    
```

#### 2. Build

Build the project. The build artifacts will be stored in the `dist/` directory.

```sh  
npm run build    
```

#### 3. Run Server

```sh  
npm start
```

Build the project and initialize the microservice. **Useful for production/deployment.**

```sh  
npm run build && npm start
```

## Running the tests

#### All tests

Run unit testing, integration and coverage by [Mocha](https://mochajs.org/) and [Instanbul](https://istanbul.js.org/).

```sh  
npm test
```

#### Unit test

```sh  
npm run test:unit
```

#### Integration test

```sh  
npm run test:integration
```

#### Coverage  test

```sh  
npm run test:cov
```

Navigate to the `coverage` directory and open the `index.html` file in the browser to see the result. Some statistics
are also displayed in the terminal.

### Generating code documentation

```sh  
npm run build:doc
```

The html documentation will be generated in the /docs directory by [typedoc](https://typedoc.org/).
