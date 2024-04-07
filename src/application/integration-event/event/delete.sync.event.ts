import { JsonUtils } from '../../domain/utils/json.utils'
import { EventType, IntegrationEvent } from './integration.event'
import { DeleteFiles } from '../../domain/model/delete.files'

export class DeleteSyncEvent extends IntegrationEvent<DeleteFiles> {
    public static readonly ROUTING_KEY: string = 'delete.sync'
    public static readonly NAME: string = 'DeleteSyncEvent'

    constructor(timestamp?: Date, files?: DeleteFiles) {
        super(EventType.DELETE, timestamp, files)
    }

    public get files(): DeleteFiles | undefined {
        return this.payload
    }

    public get routing_key(): string {
        return DeleteSyncEvent.ROUTING_KEY
    }

    public get event_name(): string {
        return DeleteSyncEvent.NAME
    }

    public fromJSON(json: any): DeleteSyncEvent {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id !== undefined) this.id = json.id
        if (json.timestamp !== undefined) this.timestamp = new Date(json.timestamp)
        if (json.files !== undefined) this.payload = new DeleteFiles().fromJSON(json.files)

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
