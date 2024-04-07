/**
 * Repository interface.
 * Must be implemented by the base repository.
 *
 * @see {@link BaseRepository} for further information.
 * @template T
 */
import { IQuery } from './query.interface'

export interface IRepository<T> {
    /**
     * Add a new item.
     *
     * @param item Item to insert.
     * @return {Promise<T>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    create(item: T): Promise<T | undefined>

    /**
     * List items according to parameter values.
     *
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<T>>}
     * @throws {RepositoryException}
     */
    find(query: IQuery): Promise<Array<T>>

    /**
     * Retrieves an item according to the parameter.
     *
     * @param query Defines object to be used for queries.
     * @return {Promise<T>}
     * @throws {ValidationException | RepositoryException}
     */
    findOne(query: IQuery): Promise<T | undefined>

    /**
     * Updates item data.
     *
     * @param item - Item containing the data to be updated
     * @return {Promise<T>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    update(item: T): Promise<T | undefined>

    /**
     * Removes the item according to their unique identifier.
     *
     * @param id - Unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    delete(id: string): Promise<boolean>

    /**
     * Returns the total of items according to the query.
     *
     * @param query Defines object to be used for queries.
     * @return {Promise<number>}
     * @throws {RepositoryException}
     */
    count(query?: IQuery): Promise<number>

    /**
     * Check if the item already exists
     *
     * @param item Item to be checked
     * @return {Promise<boolean>}
     */
    checkExists(item: T): Promise<boolean>

}
