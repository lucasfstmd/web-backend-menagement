import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { Entity } from './entity'

export class File extends Entity implements IJSONSerializable, IJSONDeserializable<File>{
    private _file_id: string | undefined
    private _file_name: string | undefined

    get file_id(): string | undefined {
        return this._file_id
    }

    set file_id(value: string | undefined) {
        this._file_id = value
    }

    get file_name(): string | undefined {
        return this._file_name
    }

    set file_name(value: string | undefined) {
        this._file_name = value
    }

    public fromJSON(json: any): File {
        if (json.file_id) this.file_id = json.file_id
        if (json.file_name) this.file_name = json.file_name

        return this
    }

    public toJSON(): any {
        return {
            file_name: this.file_name,
            file_id: this.file_id,
        }
    }
}
