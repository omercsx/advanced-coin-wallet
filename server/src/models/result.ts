export class Result {
    status: boolean;
    message: string;
    data: any;

    constructor(status: boolean, message: string, data: any) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export class SuccessResult extends Result {
    constructor(message: string, data: null | any) {
        super(true, message, data);
    }
}

export class FailureResult extends Result {
    constructor(message: string, data: null = null) {
        super(false, message, data);
    }
}
