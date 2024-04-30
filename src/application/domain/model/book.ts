import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { Entity } from './entity'

export class Book extends Entity implements IJSONSerializable, IJSONDeserializable<Book>{

    private _title?: string | undefined
    private _author?: string | undefined
    private _number_of_pages?: string | undefined
    private _year?: string | undefined
    private _isbc?: string | undefined
    private _publisher?: string | undefined

    constructor(id?: string, created_at?: string, updated_at?: string) {
        super(id, created_at, updated_at)
    }

    get title(): string | undefined {
        return this._title
    }

    set title(value: string | undefined) {
        this._title = value
    }

    get author(): string | undefined {
        return this._author
    }

    set author(value: string | undefined) {
        this._author = value
    }

    get number_of_pages(): string | undefined {
        return this._number_of_pages
    }

    set number_of_pages(value: string | undefined) {
        this._number_of_pages = value
    }

    get year(): string | undefined {
        return this._year
    }

    set year(value: string | undefined) {
        this._year = value
    }

    get isbc(): string | undefined {
        return this._isbc
    }

    set isbc(value: string | undefined) {
        this._isbc = value
    }

    get publisher(): string | undefined {
        return this._publisher
    }

    set publisher(value: string | undefined) {
        this._publisher = value
    }

    public fromJSON(json: any): Book {
        if (!json) {
            return this
        }

        if (typeof json === 'string') {
            if (!JsonUtils.isJsonString(json)) {
                return this
            }
            json = JSON.parse(json)
        }

        if (json.id !== undefined) this.id = json.id
        if (json.title !== undefined) this.title = json.title
        if (json.author !== undefined) this.author = json.author
        if (json.number_of_pages !== undefined) this.number_of_pages = json.number_of_pages
        if (json.year !== undefined) this.year = json.year
        if (json.isbc !== undefined) this.isbc = json.isbc
        if (json.publisher !== undefined) this.publisher = json.publisher

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            created_at: super.created_at,
            updated_at: super.updated_at,
            title: this.title || undefined,
            author: this.author || undefined,
            number_of_pages: this.number_of_pages || undefined,
            year: this.year || undefined,
            isbc: this.isbc || undefined,
            publisher: this.publisher || undefined,
        }
    }

}
