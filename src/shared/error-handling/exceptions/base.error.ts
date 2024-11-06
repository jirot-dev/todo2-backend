export class BaseError extends Error {
    constructor(
        public readonly messageKey: string,
        public readonly messageArgs?: Record<string, any>
    ) {
        super(messageKey);
        this.name = this.constructor.name;
    }
}