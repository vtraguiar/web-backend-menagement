import { Identifier } from 'di/identifiers'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { ILogger } from 'utils/custom.logger'
import { inject } from 'inversify'
import { ValidationException } from 'application/domain/exception/validation.exception'
import { User } from 'application/domain/model/user'
import { UserValidator } from 'application/domain/validator/user.validator'
import { UserDeleteEvent } from '../event/user.delete.event'
import { IUserService } from 'application/port/user.service.interface'

export class UserDeleteEventHandler implements IIntegrationEventHandler<UserDeleteEvent> {
    constructor(
        @inject(Identifier.USER_SERVICE) readonly userService: IUserService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ){
    }

    public handle(event: UserDeleteEvent): void {
        try {
            if (!event.user) {
                throw new ValidationException('Event is not in the expected format!', JSON.stringify(event))
            }

            const user: User = new User().fromJSON(event.user)
            UserValidator.validate(user)

            this._logger.info(`Prepare to delete user from ${user.id}...`)
            Promise.allSettled([
                this.userService.remove(user.id!)
            ]).then(results => {
                for (const result of results) {
                    if (result.status === 'rejected') {
                        this._logger.error(`Error removing user resource. ${result.reason}`)
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
