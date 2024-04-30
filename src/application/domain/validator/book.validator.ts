import { ValidationException } from '../exception/validation.exception'
import { Book } from '../model/book'

export class BookValidator {
    public static validate(book: Book): void | ValidationException {
        const fields: Array<string> = []

        if (!book.title) fields.push('Title')
        if (!book.author) fields.push('Author')
        if (!book.number_of_pages) fields.push('Number of Pages')
        if (!book.year) fields.push('Year')
        if (!book.isbc) fields.push('ISBC')
        if (!book.publisher) fields.push('Publisher')

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Book validation failed: '.concat(fields.join(', ')).concat(' required!')
            )
        }
    }
}
