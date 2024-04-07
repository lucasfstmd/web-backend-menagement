import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { File } from './file'

export class SendFile extends Entity implements IJSONSerializable, IJSONDeserializable<SendFile> {
    private _directory_id: string | undefined
    private _files: Array<File> | undefined

    get directory_id(): string | undefined {
        return this._directory_id
    }

    set directory_id(value: string | undefined) {
        this._directory_id = value
    }

    get files(): Array<File> | undefined {
        return this._files
    }

    set files(value: Array<File> | undefined) {
        this._files = value
    }

    public fromJSON(json: any): SendFile | any {
        if (json.id) super.id = json.id
        if (json.directory_id) this.directory_id = json.directory_id
        if (json.files) {
            this.files = json.files.map((file) => new File().fromJSON(file))
        }

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            directory_id: this.directory_id,
            files: this.files
        }
    }


}
