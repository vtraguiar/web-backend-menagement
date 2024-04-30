import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class User extends Entity implements IJSONSerializable, IJSONDeserializable<User>{

    private _username?: string | undefined
    private _password?: string | undefined
    private _email?: string | undefined

    constructor(id?: string, created_at?: string, updated_at?: string) {
        super(id, created_at, updated_at)
    }

    get username(): string | undefined {
        return this._username
    }

    set username(value: string | undefined) {
        this._username = value
    }

    get password(): string | undefined {
        return this._password
    }

    set password(value: string | undefined) {
        this._password = value
    }

    get email(): string | undefined {
        return this._email
    }

    set email(value: string | undefined) {
        this._email = value
    }

    public fromJSON(json: any): User {
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
        if (json.username !== undefined) this.username = json.username
        if (json.password !== undefined) this.password = json.password
        if (json.email !== undefined) this.email = json.email

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            created_at: super.created_at,
            updated_at: super.updated_at,
            username: this.username || undefined,
            password: this.password || undefined,
            email: this.email || undefined

        }
    }
}
