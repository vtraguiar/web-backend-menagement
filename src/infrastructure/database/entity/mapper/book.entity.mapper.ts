import { Book } from 'application/domain/model/book'
import { injectable } from 'inversify'
import { BookEntity } from '../book.entity'
import { IEntityMapper } from 'infrastructure/port/entity.mapper.interface'


@injectable()
export class BookEntityMapper implements IEntityMapper<Book, BookEntity> {
    public transform(item: any): any {
        if (item instanceof Book) return this.modelToModelEntity(item)
        return this.jsonToModel(item)
    }

    public modelToModelEntity(item: Book): BookEntity {
        const result: BookEntity = new BookEntity()

        if (item.title !== undefined) result.title = item.title
        if (item.author !== undefined) result.author = item.author
        if (item.number_of_pages !== undefined) result.number_of_pages = item.number_of_pages
        if (item.year !== undefined) result.year = item.year
        if (item.isbc !== undefined) result.isbc = item.isbc
        if (item.publisher !== undefined) result.publisher = item.publisher

        return result
    }

    public modelEntityToModel(item: BookEntity): Book {
        const result: Book = new Book()

        if (item.title !== undefined) result.title = item.title
        if (item.author !== undefined) result.author = item.author
        if (item.number_of_pages !== undefined) result.number_of_pages = item.number_of_pages
        if (item.year !== undefined) result.year = item.year
        if (item.isbc !== undefined) result.isbc = item.isbc
        if (item.publisher !== undefined) result.publisher = item.publisher

        return result
    }

    public jsonToModel(json: any): Book {
        const result: Book = new Book()
        if (!json) return result
        if (json.id !== undefined) result.id = json.identifiers
        if (json.title !== undefined) result.title = json.title
        if (json.author !== undefined) result.author = json.author
        if (json.number_of_pages !== undefined) result.number_of_pages = json.number_of_pages
        if (json.year !== undefined) result.year = json.year
        if (json.isbc !== undefined) result.isbc = json.isbc
        if (json.publisher !== undefined) result.publisher = json.publisher
        return result

    }

}
