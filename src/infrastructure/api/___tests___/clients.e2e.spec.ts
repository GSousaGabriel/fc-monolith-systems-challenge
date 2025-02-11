import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import request from 'supertest'
import { Umzug } from "umzug";
import { migrator } from "../config-migrations/migrator";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { clientsRoute } from "../routes/clients.route";

describe("Client api test", () => {
    const app: Express = express()
    app.use(express.json())
    app.use("/clients", clientsRoute)
    let sequelize: Sequelize;
    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([ClientModel])
        await sequelize.sync({ alter: true })
        migration = migrator(sequelize)
        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
            return
        }
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })

    test("Should create a client", async () => {
        const props = {
            id: "1",
            name: "Lucian",
            email: "lucian@teste.com",
            document: "1234-5678",
            address: {
                street: "Rua 123",
                number: "99",
                complement: "Casa Verde",
                city: "Criciúma",
                state: "SC",
                zipCode: "88888-888"
            }
        }

        const response = await request(app).post("/clients").send(props)

        expect(response.status).toBe(200)
        expect(response.body.id).toBeTruthy()
        expect(response.body.name).toEqual(props.name)
        expect(response.body.email).toEqual(props.email)
        expect(response.body.document).toEqual(props.document)
        expect(response.body.address.street).toEqual(props.address.street)
        expect(response.body.address.number).toEqual(props.address.number)
        expect(response.body.address.complement).toEqual(props.address.complement)
        expect(response.body.address.city).toEqual(props.address.city)
        expect(response.body.address.state).toEqual(props.address.state)
        expect(response.body.address.zipCode).toEqual(props.address.zipCode)
        expect(response.body.createdAt).toBeTruthy()
        expect(response.body.updatedAt).toBeTruthy()
    })
})