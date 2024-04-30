import { User } from 'application/domain/model/user'
import { IntegrationEvent } from './integration.event'
import { JsonUtils } from 'application/domain/utils/json.utils'

export class UserDeleteEvent extends IntegrationEvent<User> {
    public static readonly ROUTING_KEY: string = 'User'
    public static readonly NAME: string = 'UserDeleteEvent'

    constructor(public timestamp?: Date, public user?: User) {
        super(UserDeleteEvent.NAME, timestamp)
    }


    public get routing_key(): string{
        return 'User'
    }

    public get event_name(): string {
        return 'UserDeleteEvent'
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

    public toJSON(): any {
        if (!this.user) return {}
        return {
            ...super.toJSON(),
            ...{
                user: this.user.toJSON()
            }
        }
    }
}
