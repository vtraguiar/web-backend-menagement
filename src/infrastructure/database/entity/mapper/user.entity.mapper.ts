import { injectable } from 'inversify'
import { User } from 'application/domain/model/user'
import { UserEntity } from '../user.entity'
import { IEntityMapper } from 'infrastructure/port/entity.mapper.interface'

@injectable()
export class UserEntityMapper implements IEntityMapper<User, UserEntity> {
    public transform(item: any): any {
        if (item instanceof User) return this.modelToModelEntity(item)
        return this.jsonToModel(item)
    }

    public modelToModelEntity(item: User): UserEntity {
        const result: UserEntity = new UserEntity()

        if (item.username !== undefined) result.username = item.username
        if (item.password !== undefined) result.password = item.password
        if (item.email !== undefined) result.email = item.email
        return result
    }

    public modelEntityToModel(item: UserEntity): User {
        const result: User = new User()

        if (item.username !== undefined) result.username = item.username
        if (item.password !== undefined) result.password = item.password
        if (item.email !== undefined) result.email = item.email
        return result
    }

    public jsonToModel(json: any): User {
        const result: User = new User()
        if (!json) return result
        if (json.id !== undefined) result.id = json.identifiers
        if (json.username !== undefined) result.username = json.username
        if (json.password !== undefined) result.password = json.password
        if (json.email !== undefined) result.email = json.email
        return result
    }
}
