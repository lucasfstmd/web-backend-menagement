//import { assert } from 'chai'
import { IJSONSerializable } from '../../../src/application/domain/utils/json.serializable.interface'
/*import { IJSONDeserializable } from '../../../src/application/model/utils/json.deserializable.interface'
import { JsonUtils } from '../../../src/application/model/utils/json.utils'

class Example extends Annex2table2 implements IJSONSerializable, IJSONDeserializable<Example> {
    constructor() {
        super()
    }

    public fromJSON(json: any): Example {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        if (json.id !== undefined) super.id = json.id
        if (json.created_at !== undefined) super.created_at = json.created_at
        return this
    }

    public toJSON(): any {
        return { id: super.id, created_at: super.created_at }
    }

}

describe('Models: Entity', () => {
    const example: any = { id: '6d70a2057dba46d1a9e81ed0834557f2', created_at: '2019-09-11T14:47:00' }
    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete model model', () => {
                const result = new Example().fromJSON(example)
                assert.propertyVal(result, 'id', example.id)
                assert.propertyVal(result, 'created_at', example.created_at)
            })
        })

        context('when does not pass a json', () => {
            it('should return a model with some undefined parameters for undefined json', () => {
                const result = new Example().fromJSON(undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'created_at', undefined)
            })

            it('should return a model with some undefined parameters for empty json', () => {
                const result = new Example().fromJSON({})
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'id', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete model', () => {
                const result = new Example().fromJSON(JSON.stringify(example))
                assert.propertyVal(result, 'id', example.id)
                assert.propertyVal(result, 'created_at', example.created_at)
            })

            it('should return a model with some undefined parameters for empty string', () => {
                const result = new Example().fromJSON('')
                assert.propertyVal(result, 'id', undefined)
            })

            it('should return a model with some undefined parameters for invalid string', () => {
                const result = new Example().fromJSON('invalid')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'id', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a model as JSON', () => {
            const model = new Example().fromJSON(example)
            const result = model.toJSON()
            assert.propertyVal(result, 'id', example.id)
            assert.propertyVal(result, 'created_at', example.created_at)
        })
    })
})
*/
