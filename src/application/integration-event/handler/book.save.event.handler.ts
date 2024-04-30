import { inject } from 'inversify'
import { BookSaveEvent } from '../event/book.save.event'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { IBookService } from 'application/port/book.service.interface'
import { Identifier } from 'di/identifiers'
import { ILogger } from 'utils/custom.logger'
import { ValidationException } from 'application/domain/exception/validation.exception'
import { Book } from 'application/domain/model/book'
import { BookValidator } from 'application/domain/validator/book.validator'

export class BookSaveEventHandler implements IIntegrationEventHandler<BookSaveEvent> {
    constructor(
        @inject(Identifier.BOOK_SERVICE) readonly bookService: IBookService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ){
    }

    public handle(event: BookSaveEvent): void {
        try {
            if (!event.book) {
                throw new ValidationException('Event is not in the expected format!', JSON.stringify(event))
            }
            const book: Book = new Book().fromJSON(event.book)
            BookValidator.validate(book)

            this._logger.info(`Prepare to save book from ${book.id}...`)
            Promise.allSettled([
                this.bookService.add(book)
            ]).then(results => {
                for (const result of results) {
                    if (result.status === 'rejected') {
                        this._logger.error(`Error saving patient resource. ${result.reason}`)
                    }
                }
                this._logger.info(`Action for event ${event.event_name} sucessfully performad!`)
            })
        } catch (err: any) {
            this._logger.error(`An error ocurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
