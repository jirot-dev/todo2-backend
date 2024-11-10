import { ErrorMessages, ErrorStatus } from '../constants/error-constants';
import { BaseError } from './base.error';


export class ForbiddenError extends BaseError {
    constructor() {
        super(
            ErrorMessages.FORBIDDEN,
            undefined,
            ErrorStatus.FORBIDDEN,
            []
        );
    }
}