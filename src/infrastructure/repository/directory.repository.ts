import { IDirectoryRepository } from '../../application/port/directory.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { Directory } from '../../application/domain/model/directory'
import { DirectoryEntity } from '../database/entity/directory.entity'
import { BaseRepository } from './base/base.repository'

@injectable()
export class DirectoryRepository extends BaseRepository<Directory, DirectoryEntity> implements IDirectoryRepository {
    constructor(
        @inject(Identifier.DIRECTORY_REPO_MODEL) readonly _model: any,
        @inject(Identifier.DIRECTORY_MAPPER) readonly _mapper: IEntityMapper<Directory, DirectoryEntity>,
        @inject(Identifier.LOGGER) readonly _logger: any
    ) {
        super(_model, _mapper, _logger)
    }
}
