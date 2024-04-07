import { TypeDrive } from '../utils/enum'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { File } from './file'
import { Entity } from './entity'

export class Directory extends Entity implements IJSONSerializable, IJSONDeserializable<Directory>{
    private _type: TypeDrive | undefined
    private _name: string | undefined
    private _directory: string | undefined
    private _files?: Array<File> | undefined

    constructor() {
        super()
    }

    get type(): TypeDrive | undefined {
        return this._type
    }

    set type(value: TypeDrive | undefined) {
        this._type = value
    }

    get name(): string | undefined {
        return this._name
    }

    set name(value: string | undefined) {
        this._name = value
    }

    get directory(): string | undefined {
        return this._directory
    }

    set directory(value: string | undefined) {
        this._directory = value
    }

    get files(): File[] | undefined {
        return this._files
    }

    set files(value: File[] | undefined) {
        this._files = value
    }

    public fromJSON(json: any): Directory | any {
        if (json.id) super.id = json.id
        if (json.name) this.name = json.name
        if (json.type) this.type = json.type
        if (json.directory) this.directory = json.directory
        if (json.file) {
            this.files = json.files.map((file) => new File().fromJSON(file))
        }

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            name: this.name,
            type: this.name,
            directory: this.directory,
            files: this.files
        }
    }
}
