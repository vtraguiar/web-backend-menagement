import { Book } from 'application/domain/model/book'
import { IRepository } from './repository.interface'

export interface IBookRepository extends IRepository<Book> {
    checkExist(library: Book): Promise<boolean>
}
