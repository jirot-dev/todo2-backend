import { ErrorMessages, ErrorStatus } from '../constants/error-constant';
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