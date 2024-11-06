import { BaseError } from './base.error';


export class ValidationError extends BaseError {
    constructor(
        public readonly messageKey: string,
        public readonly messageArgs?: Record<string, any>,
        public readonly fieldName?: string
    ) {
        super(messageKey);
    }
}