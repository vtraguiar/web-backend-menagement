/**
 * Constants used in dependence injection.
 *
 * @abstract
 */
export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly DIRECTORY_CONTROLLER: any = Symbol.for('DirectoryController')

    // Services
    public static readonly DIRECTORY_SERVICE: any = Symbol.for('DirectoryService')
    public static readonly BOOK_SERVICE: any = Symbol.for('BookService')
    public static readonly USER_SERVICE: any = Symbol.for('UserService')

    // Repositories
    public static readonly INTEGRATION_EVENT_REPOSITORY: any = Symbol.for('IntegrationEventRepository')
    public static readonly DIRECTORY_REPOSITORY: any = Symbol.for('DirectoryRepository')
    public static readonly BOOK_REPOSITORY: any = Symbol.for('BookRepository')
    public static readonly USER_REPOSITORY: any = Symbol.for('UserRepository')

    // Models
    public static readonly INTEGRATION_EVENT_REPO_MODEL: any = Symbol.for('IntegrationEventRepoModel')
    public static readonly DIRECTORY_REPO_MODEL: any = Symbol.for('DirectoryRepoModel')
    public static readonly BOOK_REPO_MODEL: any = Symbol.for('BookRepoModel')
    public static readonly USER_REPO_MODEL: any = Symbol.for('UserRepoModel')

    // Mappers
    public static readonly DIRECTORY_MAPPER: any = Symbol.for('DirectoryMapper')
    public static readonly BOOK_ENTITY_MAPPER: any = Symbol.for('BookEntityMapper')
    public static readonly USER_ENTITY_MAPPER: any = Symbol.for('UserEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryRabbitMQ')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('ConnectionRabbitMQ')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')


    // Tasks
    public static readonly PUBLISH_EVENT_BUS_TASK: any = Symbol.for('PublishEventBusTask')
    public static readonly SUBSCRIBE_EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')
    public static readonly RPC_SERVER_EVENT_BUS_TASK: any = Symbol.for('RpcServerEventBusTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
