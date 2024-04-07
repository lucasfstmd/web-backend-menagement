import { assert } from 'chai'
import { DatetimeValidator } from '../../../src/application/domain/validator/date.time.validator'
import { Strings } from '../../../src/utils/strings'

describe('Validators: DateTimeValidator', () => {
    it('should return undefined when the validation was successful', () => {
        // @ts-ignore
        const result = DatetimeValidator.validate('2018-01-02T00:04:03.000Z')
        assert.equal(result, undefined)
    })

    context('when there are missing or invalid parameters', () => {
        it('should throw error for does pass invalid date time', () => {
            try {
                // @ts-ignore
                DatetimeValidator.validate('02-08-2018')
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '02-08-2018'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.INVALID_DATETIME_FORMAT_DESC)
            }
        })
    })
})
