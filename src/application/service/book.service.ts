import { Book } from 'application/domain/model/book'
import { IBookRepository } from 'application/port/book.repository.interface'
import { IBookService } from 'application/port/book.service.interface'
import { IQuery } from 'application/port/query.interface'
import { Identifier } from 'di/identifiers'
import { inject, injectable } from 'inversify'

@injectable()
export class BookService implements IBookService {

    constructor(@inject(Identifier.BOOK_REPOSITORY) private readonly _bookRepository: IBookRepository) {
    }


    public async add(book: Book): Promise<Book | undefined> {
        try {
            const result: Book | undefined = await this._bookRepository.create(book)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<Book>> {
        return this._bookRepository.find(query)
    }


    public async getById(id: string | number, query: IQuery): Promise<Book | undefined> {
        query.filters = {_id: id }
        return this._bookRepository.findOne(query)
    }

    public async update(book: Book): Promise<Book | undefined> {
        return this._bookRepository.update(book)
    }

    public async remove(id: string): Promise<boolean> {
        return this._bookRepository.delete(id)
    }

    public async count(query: IQuery): Promise<number> {
        return Promise.resolve(0)
    }

}
