export const ErrorMessages = {
    INTERNAL: 'errors.internal',
    DATABASE: 'errors.database',
    BAD_REQUEST: 'errors.badRequest',
    UNAUTHORIZED: 'error.unauthorized',
    FORBIDDEN: 'error.forbidden',
    NOT_FOUND: 'errors.notFound',
    PARAM_NOT_FOUND: 'errors.paramNotFound',
    ITEM_VALIDATION: 'errors.item.validation',
    ITEM_UPDATE_TOKEN: 'errors.item.updateToken',
    ITEM_UPDATE_LOCK: 'errors.item.updateLock',
    FIELD_REQUIRED: 'errors.field.required',
    FIELD_LENGTH: 'errors.field.length',
    FIELD_RANGE: 'errors.field.range',
} as const;

export const ErrorStatus = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
} as const;