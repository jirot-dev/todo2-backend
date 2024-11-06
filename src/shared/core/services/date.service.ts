import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
    getCurrentUtcDateTime(): Date {
        var now = new Date();
        return new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        ));
    }
}