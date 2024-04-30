import { Book } from 'application/domain/model/book'
import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { IBookRepository } from 'application/port/book.repository.interface'
import { ILogger } from 'utils/custom.logger'
import { Identifier } from 'di/identifiers'
import { IQuery } from 'application/port/query.interface'
import { Query } from './query/query'
import { BookEntity } from 'infrastructure/database/entity/book.entity'
import { BookEntityMapper } from 'infrastructure/database/entity/mapper/book.entity.mapper'


@injectable()
export class BookRepository extends BaseRepository<Book, BookEntity> implements IBookRepository {
    constructor(
        @inject(Identifier.BOOK_REPO_MODEL) readonly bookModel: any,
        @inject(Identifier.BOOK_ENTITY_MAPPER) readonly bookMapper: BookEntityMapper,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ){
        super(bookModel, bookMapper, logger)
    }

    public find(query: IQuery): Promise<Array<Book>> {
        const q: any = query.toJSON()
        return new Promise<Array<Book>>((resolve, reject) => {
            this.Model.find(q.filters)
                .select(q.fields)
                .populate('library')
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .exec()
                .then((result: Array<BookEntity>) => {
                    resolve(result.map(item => this.bookMapper.transform(item)))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public findOne(query: IQuery): Promise<Book> {
        const q: any = query.toJSON()
        return new Promise<Book>((resolve, reject) => {
            this.Model.findOne(q.filters)
                .select(q.fields)
                .populate('library')
                .exec()
                .then((result: BookEntity) => {
                    if (!result) return resolve(new Book())
                    return resolve(this.bookMapper.transform(result))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public update(item: Book): Promise<Book> {
        const library: BookEntity = this.bookMapper.transform(item)
        return new Promise<Book>((resolve, reject) => {
            this.Model.findOneAndUpdate({_id: item.id}, library, {new: true})
                .exec()
                .then(result => {
                    if (!result) return resolve(new Book())
                    result.populate('library')
                    .execPopulate()
                    .then((res) => resolve(this.bookMapper.transform(res)))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public async checkExist(book: Book): Promise<boolean> {
        const query: Query = new Query()
        return new Promise<boolean>((resolve, reject) => {
            if (book.title && book.id) {
                query.filters = {title: book.title, id: book.id}
            }
            super.findOne(query)
                .then((result: Book | undefined) => {
                    if (result) return resolve(true)
                    return resolve(false)
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

}
