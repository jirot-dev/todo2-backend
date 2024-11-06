export interface AppClsStore {
    resource?: string;
    resourceId?: string | number;
    userId?: number;
    tenantId?: string;
    language?: string;
    timezone?: string;
    correlationId?: string;
    [key: string]: any;
    [key: symbol]: any;
  }