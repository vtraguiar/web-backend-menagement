import { IntegrationEvent } from './integration.event'
import { User } from '../../domain/model/user'
import { JsonUtils } from 'application/domain/utils/json.utils'

export class UserSaveEvent extends IntegrationEvent<User> {
    public static readonly ROUTING_KEY: string = 'users.save'
    public static readonly NAME: string = 'UsersSaveEvent'

    constructor(public timestamp?: Date, public user?: User) {
        super(UserSaveEvent.NAME, timestamp)
    }

    public get routing_key(): string{
        return 'users.save'
    }

    public get event_name(): string {
        return 'UsersSaveEvent'
    }

    public fromJSON(json: any): IntegrationEvent<User> {
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

    public tooJSON(): any {
        if (!this.user) return {}
        return {
            ...super.toJSON(),
            ...{
                user: this.user.toJSON()
            }
        }
    }
}
