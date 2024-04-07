import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'

export class DeleteFiles extends Entity implements IJSONSerializable, IJSONDeserializable<DeleteFiles> {
    private _files_ids: Array<string> | undefined


    get files_ids(): Array<string> | undefined {
        return this._files_ids
    }

    set files_ids(value: Array<string> | undefined) {
        this._files_ids = value
    }

    public fromJSON(json: any): DeleteFiles | any {
        if (json.id) super.id = json.id
        if (json.files_ids) this.files_ids = json.files_ids

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            files_ids: this.files_ids,
        }
    }
}
