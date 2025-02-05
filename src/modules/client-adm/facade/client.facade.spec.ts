import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientFacade from "./client.facade";
import ClientFacadeFactory from "../factory/client.factory";

describe("ClientAdmFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        })

        await sequelize.addModels([ClientModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    test("Should create a client", async () => {
        const clientFacade = ClientFacadeFactory.create()

        const input = {
            id: "1",
            name: "client 1",
            email: "email@email.com",
            address: "address 1"
        }

        await clientFacade.add(input)

        const client = await ClientModel.findOne({ where: { id: input.id } })

        expect(client.id).toBe(input.id)
        expect(client.name).toBe(input.name)
        expect(client.email).toBe(input.email)
        expect(client.address).toBe(input.address)
    })

    test("Should find a client", async () => {
        const clientFacade = ClientFacadeFactory.create()

        const input = {
            id: "1",
            name: "client 1",
            email: "email@email.com",
            address: "address 1"
        }

        await clientFacade.add(input)
        const stockStatus = await clientFacade.find({ id: input.id })

        expect(stockStatus.id).toBe(input.id)
        expect(stockStatus.name).toBe(input.name)
        expect(stockStatus.email).toBe(input.email)
        expect(stockStatus.address).toBe(input.address)
    })
})