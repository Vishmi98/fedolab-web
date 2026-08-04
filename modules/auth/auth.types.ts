export type LoginFormType = {
    email: string;
}

export type LoginResponseDataType = {
    success: boolean;
    message: string;
    email: string;
}

export type LoginResponseType = {
    success: boolean;
    message: string;
    data: { email: string }
}

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export type EmailModalTypes = {
    pin: string;
}

export type VerifyDataType = {
    email: string;
    pin: string;
}

export type VerifyUserResponseDataType = {
    success: boolean;
    message?: string;
    token?: string
}

export type VerifyUserResponseType = {
    success: boolean;
    message: string;
    data: { token: string, isVerify: boolean }
}