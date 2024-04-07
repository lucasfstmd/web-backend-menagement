export class FieldToCamelCase {

    public static fieldToCamelCase(field: string): string {
        const fieldParts: Array<string> = field.split('_')
        return fieldParts
            ?.reduce((accumulated: string, current: string, index: number) => {
                const newAccumulated = index === 1 ?
                    `${accumulated.substr(0, 1).toUpperCase()}${accumulated.substr(1)}`
                    : accumulated
                return `${newAccumulated} ${current.substr(0, 1).toUpperCase()}${current.substr(1)}`
            }, '') || ''
    }
}
