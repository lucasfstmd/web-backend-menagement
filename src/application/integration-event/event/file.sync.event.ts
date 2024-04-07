import { JsonUtils } from '../../domain/utils/json.utils'
import { EventType, IntegrationEvent } from './integration.event'
import { SendFile } from '../../domain/model/send.file'

export class FileSyncEvent extends IntegrationEvent<SendFile> {
    public static readonly ROUTING_KEY: string = 'files.sync'
    public static readonly NAME: string = 'FileSyncEvent'

    constructor(timestamp?: Date, files?: SendFile) {
        super(EventType.FILE, timestamp, files)
    }

    public get files(): SendFile | undefined {
        return this.payload
    }

    public get routing_key(): string {
        return FileSyncEvent.ROUTING_KEY
    }

    public get event_name(): string {
        return FileSyncEvent.NAME
    }

    public fromJSON(json: any): FileSyncEvent {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id !== undefined) this.id = json.id
        if (json.timestamp !== undefined) this.timestamp = new Date(json.timestamp)
        if (json.files !== undefined) this.payload = new SendFile().fromJSON(json.files)

        return this
    }

    public toJSON(): any {
        if (!this.files) return {}
        return {
            ...super.toJSON(),
            ...{
                files: this.files.toJSON()
            }
        }
    }
}
