import { User } from 'application/domain/model/user'
import { BaseRepository } from './base/base.repository'
import { IUserRepository } from 'application/port/user.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from 'di/identifiers'
import { IQuery } from 'application/port/query.interface'
import { IEventBus } from 'infrastructure/port/event.bus.interface'
import { ILogger } from 'utils/custom.logger'
import { Query } from './query/query'
import { UserSaveEvent } from 'application/integration-event/event/user.save.event'
import { UserEntity } from 'infrastructure/database/entity/user.entity'
import { IEntityMapper } from 'infrastructure/port/entity.mapper.interface'


@injectable()
export class UserRepository extends BaseRepository<User, UserEntity> implements IUserRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) readonly userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.RABBITMQ_EVENT_BUS) readonly _rabbitMQEventBus: IEventBus,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ){
        super(userModel, userMapper, logger)
    }

    public create(item: User): Promise<User> {
        const itemNew: UserEntity = this.mapper.transform(item)
        return new Promise<User>((resolve, reject) => {
            this.Model.create(itemNew)
            .then(result => {
                resolve(this.mapper.transform(result))
                this.logger.info('Publish user on message bus...')
                this._rabbitMQEventBus.publish(
                    new UserSaveEvent(new Date(), result)
                )
            })
            .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public async getByEmail(e: string, query: IQuery): Promise<User | undefined> {
        query.filters = {email: e}
        return super.findOne(query)
    }

    public checkExist(user: User): Promise<boolean> {
     return new Promise<boolean>((resolve, reject) => {
        const email: any = user.email ? user.email : ''
        this.getByEmail(email, new Query())
        .then((result: User | undefined) => {
            if (result) return resolve(true)
            return resolve(false)
        }).catch(err => reject(super.mongoDBErrorListener(err)))
     })
    }
}
