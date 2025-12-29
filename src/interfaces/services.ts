export interface ErrorDataProps {
    type: string;
    title: string;
    message: string;
}

export interface ErrorsPayloadProps {
    value: string;
    msg: string;
    param: string;
    location: string;
}

export interface ResponseAsyncProps {
    error: boolean;
    response: any;
}

export interface ResponseAsyncPropsData {
    data: any;
    error?: undefined;
}

export interface ErrorsDataPayloadProps extends ErrorDataProps {
    errors: ErrorsPayloadProps[];
};

export interface ResponseDataProps<T> {
    data: T;
    isLoaded: boolean;
    status: number;
    message: string;
    error: boolean;
}
