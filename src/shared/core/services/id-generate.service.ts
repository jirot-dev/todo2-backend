import { Injectable } from '@nestjs/common';
import { v4, v7 } from 'uuid';

@Injectable()
export class IdGenerateService {
    generateRandomId(): string {
        return v4();
    }

    generateTimebaseId(): string {
        return v7();
    }
}