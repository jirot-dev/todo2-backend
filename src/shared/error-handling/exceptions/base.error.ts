export class BaseError extends Error {
  constructor(
    protected readonly messageKey: string,
    protected readonly messageArgs?: Record<string, any>,
    protected readonly status?: number,
    protected readonly subErrors: BaseError[] = []
  ) {
    super(messageKey);
    this.name = this.constructor.name;
  }

  getMessageKey(): string {
    return this.messageKey;
  }

  getMessageArgs(): Record<string, any> | undefined {
    return this.messageArgs;
  }

  getStatus(): number | undefined {
    return this.status;
  }

  getSubErrors(): BaseError[] {
    return this.subErrors;
  }

  hasSubErrors(): boolean {
    return this.subErrors.length > 0;
  }

  addSubError(error: BaseError): this {
    this.subErrors.push(error);
    return this;
  }

  addSubErrors(errors: BaseError[]): this {
    this.subErrors.push(...errors);
    return this;
  }
}