import "reflect-metadata"
import { DataSource } from "typeorm"
import {Nota} from './entity/Nota'
import {User} from './entity/User' 

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "ep-quiet-meadow-a8zotd8y-pooler.eastus2.azure.neon.tech",
    port: 5432,
    username: "neondb_owner",
    password: "npg_ohCviYqwbW84",
    database: "prueba_tecnica",
    synchronize: true,
    logging: false,
    entities: [User, Nota],
    migrations: [],
    subscribers: [],
    ssl: true
})
