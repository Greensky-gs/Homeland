declare global {
    namespace NodeJS {
        interface ProcessEnv {
            token: string;
            db_name: string;
            db_user: string;
            db_password: string;
            db_host: string;
        }
    }
}

export {}