export class ObjectValidation {

    public static isValidObject(object: any): boolean {
        return object
            && 'name' in object
            && 'data' in object
            && object.name
            && object.data
    }
}
