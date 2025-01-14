import { IDirectoryService } from '../port/directory.service.interface'
import { Directory } from '../domain/model/directory'
import { IQuery } from '../port/query.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IDirectoryRepository } from '../port/directory.repository.interface'
import { ConflictException } from '../domain/exception/conflict.exception'
import { Strings } from '../../utils/strings'
import { Query } from '../../infrastructure/repository/query/query'
import { TypeDrive } from '../domain/utils/enum'
import { SendFile } from '../domain/model/send.file'
import { DeleteFiles } from '../domain/model/delete.files'
import { IntegrationEventRepository } from '../../infrastructure/repository/integration.event.repository'
import { DeleteSyncEvent } from '../integration-event/event/delete.sync.event'

@injectable()
export class DirectoryService implements IDirectoryService {

    constructor(
        @inject(Identifier.DIRECTORY_REPOSITORY) private readonly _repository: IDirectoryRepository,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepositoy: IntegrationEventRepository,
    ) {
    }

    public async add(item: Directory): Promise<Directory | undefined> {
        try {
            const exist = await this._repository.checkExists(item)
            if (exist) throw new ConflictException(Strings.ERROR_MESSAGE.FILE_ALREADY_EXISTS)

            const isRoot = await this._repository.find(new Query().fromJSON({
                type: TypeDrive.ROOT
            }))

            if (isRoot.length > 1) {
                throw new ConflictException(Strings.ERROR_MESSAGE.ROOT_ALREADY_EXISTS)
            }

            const result = await this._repository.create(item)

            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(query: IQuery): Promise<number> {
        return this._repository.count(query)
    }

    public async createFolder(name: string, directory_id: string): Promise<Directory | undefined> {
        try {
            const query = new Query()
            query.addFilter({
                _name: name
            })
            const exist = await this._repository.findOne(query)
            if (exist) throw new ConflictException(Strings.ERROR_MESSAGE.FILE_ALREADY_EXISTS_NAME)

            const result = await this._repository.create(new Directory().fromJSON({
                name,
                type: TypeDrive.DIRECTORY,
                directory: directory_id
            }))

            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async deleteDirectory(directory_id: string): Promise<boolean> {
        try {
            const directory = await this._repository.findOne(new Query().fromJSON({
                _id: directory_id
            }))

            const file: DeleteFiles = new DeleteFiles()

            if (directory?.files instanceof Array) {
                for (const fl of directory?.files) {
                    file.files_ids?.push(`${fl.file_id}`)
                }

                await this._integrationEventRepositoy.publishEvent(new DeleteSyncEvent(new Date(), file))
                await this.remove(directory_id)
            }

            return Promise.resolve(true)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public getAll(query: IQuery): Promise<Array<Directory>> {
        return this._repository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<Directory | undefined> {
        query.addFilter({ _id: id })
        return this._repository.findOne(query)
    }

    public remove(id: string): Promise<boolean> {
        return this._repository.delete(id)
    }

    public update(item: Directory): Promise<Directory | undefined> {
        return this._repository.update(item)
    }

    public async updateFolder(item: Directory): Promise<Directory | undefined> {
        try {
            if (item.type !== TypeDrive.DIRECTORY) throw new ConflictException(Strings.ERROR_MESSAGE.CANNOT_CHANGE_THE_TYPE)

            const result = await this._repository.update(item)

            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async uploadFiles(files: SendFile): Promise<Directory | undefined> {
        try {
            if (!files.files?.length) {
                throw new Error(Strings.ERROR_MESSAGE.FILE_NOT_PROVIDE)
            }

            const directory = await this._repository.findOne(new Query().fromJSON({
                _id: files.directory_id
            }))

            directory?.files?.push(...files.files)

            if (directory instanceof Directory) {
                const result = await this._repository.update(directory)
                return Promise.resolve(result)
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }

}
