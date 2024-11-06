import { BaseError } from './base.error';


export class AggregateError extends BaseError {
    constructor(public readonly errors: BaseError[]) {
        super('errors.aggregate');
    }
}