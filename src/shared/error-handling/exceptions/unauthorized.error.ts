import { ErrorMessages, ErrorStatus } from '../constants/error-constants';
import { BaseError } from './base.error';


export class UnauthorizedError extends BaseError {
    constructor() {
        super(
            ErrorMessages.UNAUTHORIZED,
            undefined,
            ErrorStatus.UNAUTHORIZED,
            []
        );
    }
}