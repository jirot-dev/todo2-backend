import { ErrorMessages, ErrorStatus } from '../constants/error-constant';
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