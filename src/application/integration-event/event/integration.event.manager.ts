import { Strings } from '../../../utils/strings'
import { EventBusException } from '../../domain/exception/eventbus.exception'
import { IJSONSerializable } from '../../domain/utils/json.serializable.interface'
import { IntegrationEvent } from './integration.event'
import { FileSyncEvent } from './file.sync.event'

export abstract class IntegrationEventManager {

    private static buildByName(event: any): IntegrationEvent<IJSONSerializable> {
        const buildFn = {
            'FileSyncEvent': () => new FileSyncEvent().fromJSON(event),
        }[event.event_name]

        if (buildFn === undefined)
            throw new EventBusException(Strings.ERROR_MESSAGE.EVENT_BUS.DEFAULT_MESSAGE,
                Strings.ERROR_MESSAGE.EVENT_BUS.UNEXPECTED_EVENT_NAME.replace('{0}', event.event_name))


        return buildFn()
    }

    public static build(event: any): IntegrationEvent<IJSONSerializable> {
        return IntegrationEventManager.buildByName(event)
    }
}
