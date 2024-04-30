import { User } from 'application/domain/model/user'
import { IQuery } from './query.interface'
import { IRepository } from './repository.interface'

export interface IUserRepository extends IRepository<User> {



    getByEmail(email: string, query: IQuery): Promise<User | undefined>

    checkExist(user: User): Promise<boolean>
}
