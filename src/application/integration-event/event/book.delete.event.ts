import { Book } from 'application/domain/model/book'
import { IntegrationEvent } from './integration.event'
import { JsonUtils } from 'application/domain/utils/json.utils'

export class BookDeleteEvent extends IntegrationEvent<Book> {
    public static readonly ROUTING_KEY: string = 'Book'
    public static readonly NAME: string = 'BookDeleteEvent'

    constructor(public timestamp?: Date, public book?: Book) {
        super(BookDeleteEvent.NAME, timestamp)
    }


    public get routing_key(): string{
        return 'Book'
    }

    public get event_name(): string {
        return 'BookDeleteEvent'
    }

    public fromJSON(json: any): IntegrationEvent<Book> {
        if (!json) {
            return this
        }

        if (typeof json === 'string') {
            if (!JsonUtils.isJsonString(json)) {
                return this
            }
            json = JSON.parse(json)
        }

        return this
    }

    public toJSON(): any {
        if (!this.book) return {}
        return {
            ...super.toJSON(),
            ...{
                book: this.book.toJSON()
            }
        }
    }
}
