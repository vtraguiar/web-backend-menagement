import { inject } from 'inversify'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { Identifier } from 'di/identifiers'
import { ILogger } from 'utils/custom.logger'
import { ValidationException } from 'application/domain/exception/validation.exception'
import { User } from 'application/domain/model/user'
import { UserSaveEvent } from '../event/user.save.event'
import { IUserService } from 'application/port/user.service.interface'
import { UserValidator } from 'application/domain/validator/user.validator'

export class UserSaveEventHandler implements IIntegrationEventHandler<UserSaveEvent> {
    constructor(
        @inject(Identifier.USER_SERVICE) readonly userService: IUserService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ){
    }

    public handle(event: UserSaveEvent): void {
        try {
            if (!event.user) {
                throw new ValidationException('Event is not in the expected format!', JSON.stringify(event))
            }
            const user: User = new User().fromJSON(event.user)
            UserValidator.validate(user)

            this._logger.info(`Prepare to save user from ${user.id}...`)
            Promise.allSettled([
                this.userService.add(user)
            ]).then(results => {
                for (const result of results) {
                    if (result.status === 'rejected') {
                        this._logger.error(`Error saving user resource. ${result.reason}`)
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
