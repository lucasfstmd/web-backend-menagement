import { Entity } from '../../domain/model/entity'
import { IJSONDeserializable } from '../../domain/utils/json.deserializable.interface'
import { IJSONSerializable } from '../../domain/utils/json.serializable.interface'

export abstract class IntegrationEvent<T extends IJSONSerializable> extends Entity
    implements IJSONSerializable, IJSONDeserializable<IntegrationEvent<T>>{

    protected constructor(readonly type: string, public timestamp?: Date, protected payload?: T) {
        super()
    }

    public abstract get routing_key(): string

    public abstract get event_name(): string

    public abstract fromJSON(json: any): IntegrationEvent<T>

    public toJSON(): any {
        return {
            event_name: this.event_name,
            timestamp: this.timestamp,
            type: this.type,
        }
    }
}

export enum EventType {
    FILE = 'file',
    DELETE = 'Delete'
}
