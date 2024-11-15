import { ErrorMessages, ErrorStatus } from '../constants/error.constant';
import { ApplicationError } from './application.error';


export class ForbiddenError extends ApplicationError {
    constructor() {
        super(
            ErrorMessages.FORBIDDEN,
            undefined,
            ErrorStatus.FORBIDDEN,
            []
        );
    }
}