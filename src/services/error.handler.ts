import { ErrorHandler } from '@angular/core';

export class AppErrorHandler implements ErrorHandler {
    constructor(public originalError?: any) {}
    handleError(error) {
        console.log(error);
    }
}
export class BadInput extends AppErrorHandler {}
export class NotAllowedError extends AppErrorHandler {}
export class NotFoundError extends AppErrorHandler {}