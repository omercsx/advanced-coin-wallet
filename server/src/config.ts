import dotenv from 'dotenv';

dotenv.config();

export class Config {
    public PORT: string;
    public mongoUrl: string;
    public secretKey: string;

    constructor() {
        if (!process.env.PORT) {
            throw new Error("PORT must be specified!");
        }
        this.PORT = process.env.PORT;

        if (!process.env.CONNECTION_URL) {
            throw new Error("CONNECTION_URL must be specified!");
        }
        this.mongoUrl = process.env.CONNECTION_URL;

        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY must be specified!");
        }
        this.secretKey = process.env.SECRET_KEY;
    }
}

export const config = new Config();