import { injectable } from 'inversify'
import { IEntityMapper } from '../../../port/entity.mapper.interface'
import { Directory } from '../../../../application/domain/model/directory'
import { DirectoryEntity } from '../directory.entity'
import { File } from '../../../../application/domain/model/file'

@injectable()
export class DirectoryMapper implements IEntityMapper<Directory, DirectoryEntity> {
    public modelEntityToModel(item: DirectoryEntity): Directory {
        throw new Error('Method not implemented.')
    }
    public transform(item: any): any {
        if (item instanceof Directory) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert {Directory} for {QuestionnaireEntity}.
     *
     * @see Before setting the value, it is important to verify that the type is valid.
     * Therefore, you do not run the risk that in an UPDATE / PATCH action type,
     * attributes that should not be updated are saved with null values.
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown.
     * @param item
     */
    public modelToModelEntity(item: Directory): DirectoryEntity {
        const result: DirectoryEntity = new DirectoryEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.type !== undefined) result.type = item.type
        if (item.name !== undefined) result.name = item.name
        if (item.directory !== undefined) result.directory = item.directory
        if (item.files !== undefined) result.files = item.files

        return result
    }

    /**
     * Convert JSON for {Questionnaire}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): Directory {
        const result: Directory = new Directory()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.created_at !== undefined) result.created_at = json.created_at
        if (json.updated_at !== undefined) result.updated_at = json.updated_at
        if (json.type !== undefined) result.type = json.type
        if (json.name !== undefined) result.name = json.name
        if (json.directory !== undefined) result.directory = json.directory
        if (json.files !== undefined)
            result.files = json.files.map(file => new File().fromJSON(file))

        return result
    }
}
