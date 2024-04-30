import { IUserService } from 'application/port/user.service.interface'
import { injectable, inject } from 'inversify'
import { Identifier } from 'di/identifiers'
import { User } from 'application/domain/model/user'
import { IQuery } from 'application/port/query.interface'
import { IUserRepository } from 'application/port/user.repository.interface'

@injectable()
export class UserService implements IUserService {
    constructor(@inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository) {
    }

    public async add(user: User): Promise<User | undefined> {
        try {
            const result: User | undefined = await this._userRepository.create(user)
            return Promise.resolve(result)
        }   catch (err) {
            return Promise.reject(err)
        }
    }



    public async getAll(query: IQuery): Promise<Array<User>> {
        return this._userRepository.find(query)
    }


    public async getById(id: string | number, query: IQuery): Promise<User | undefined> {
        query.filters = { _id: id }
        return this._userRepository.findOne(query)
    }

    public async update(user: User): Promise<User | undefined> {
        return this._userRepository.update(user)
    }

    public async remove(id: string): Promise<boolean> {
        return this._userRepository.delete(id)
    }

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(0)
    }
}
