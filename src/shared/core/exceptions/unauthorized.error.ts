import { ErrorMessages, ErrorStatus } from '../constants/error.constant';
import { ApplicationError } from './application.error';


export class UnauthorizedError extends ApplicationError {
    constructor() {
        super(
            ErrorMessages.UNAUTHORIZED,
            undefined,
            ErrorStatus.UNAUTHORIZED,
            []
        );
    }
}