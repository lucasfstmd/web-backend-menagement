import { IQuery } from './query.interface'

/**
 * Service interface.
 * Must be implemented by all other service created.
 *
 * @template T
 */
export interface IService<T> {
    /**
     * Add a new item.
     *
     * @param item T to insert.
     * @return {Promise<T>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    add(item: T): Promise<T | undefined>

    /**
     * Listing items according to parameter values.
     *
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<T>>}
     * @throws {RepositoryException}
     */
    getAll(query: IQuery): Promise<Array<T>>

    /**
     * Retrieves the item by their unique identifier.
     *
     * @param id Unique identifier.
     * @param query Defines object to be used for queries.
     * @return {Promise<T>}
     * @throws {ValidationException | RepositoryException}
     */
    getById(id: string, query: IQuery): Promise<T | undefined>

    /**
     * Updates item data.
     *
     * @param item Containing the data to be updated
     * @return {Promise<T>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    update(item: T): Promise<T | undefined>

    /**
     * Removes the item according to their unique identifier.
     *
     * @param id Unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    remove(id: string): Promise<boolean>

    /**
     * Returns the total of items according to the query.
     *
     * @param query Defines object to be used for queries.
     * @return {Promise<number>}
     * @throws {ValidationException | RepositoryException}
     */
    count(query: IQuery): Promise<number>
}
