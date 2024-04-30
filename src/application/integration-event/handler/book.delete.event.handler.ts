import { Identifier } from 'di/identifiers'
import { BookDeleteEvent } from '../event/book.delete.event'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { ILogger } from 'utils/custom.logger'
import { inject } from 'inversify'
import { ValidationException } from 'application/domain/exception/validation.exception'
import { Book } from 'application/domain/model/book'
import { BookValidator } from 'application/domain/validator/book.validator'
import { IBookService } from 'application/port/book.service.interface'

export class BookDeleteEventHandler implements IIntegrationEventHandler<BookDeleteEvent> {
    constructor(
        @inject(Identifier.BOOK_SERVICE) readonly bookService: IBookService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ){
    }

    public handle(event: BookDeleteEvent): void {
        try {
            if (!event.book) {
                throw new ValidationException('Event is not in the expected format!', JSON.stringify(event))
            }

            const book: Book = new Book().fromJSON(event.book)
            BookValidator.validate(book)

            this._logger.info(`Prepare to delete book from ${book.id}...`)
            Promise.allSettled([
                this.bookService.remove(book.id!)
            ]).then(results => {
                for (const result of results) {
                    if (result.status === 'rejected') {
                        this._logger.error(`Error removing book resource. ${result.reason}`)
                    }
                }
                this._logger.info(`Action for event ${event.event_name} successfully performad!`)
            })
        } catch (err: any) {
            this._logger.error(`An erro ocurred while attempting `
                .concat(`Perform the operation with the ${event.event_name}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
