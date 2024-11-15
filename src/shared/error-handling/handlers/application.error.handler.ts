import { ErrorMessages, ErrorStatus } from "src/shared/core/constants/error.constant";
import { ApplicationError } from "src/shared/core/exceptions/application.error";
import { AbstractErrorHandler } from "./abstract.error.handler";

export class ApplicationErrorHandler extends AbstractErrorHandler<ApplicationError> {
    constructor() {
      super(ApplicationError, ErrorStatus.BAD_REQUEST, ErrorMessages.INTERNAL);
    }
  }