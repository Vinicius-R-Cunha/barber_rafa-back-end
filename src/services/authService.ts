export interface SignUpData {
    name: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirmation: string;
}

export type SignInData = Omit<
    SignUpData,
    "name" | "phone" | "passwordConfirmation"
>;

export async function signUp(body: SignUpData) {}

export async function signIn(body: SignInData) {}
