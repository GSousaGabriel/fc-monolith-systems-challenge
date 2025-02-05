import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientModel from "./client.model";
import Client from "../domain/client.entity";
import ClientRepository from "./client.repository";

describe("ClientRepository test", () => {
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
        const props = {
            id: new Id("1"),
            name: "client 1",
            email: "email@email.com",
            address: "address"
        }

        const client = new Client(props)
        const clientRepository = new ClientRepository()
        await clientRepository.add(client)

        const clientDb = await ClientModel.findOne({
            where: { id: props.id.id }
        })

        expect(clientDb.id).toBe(props.id.id)
        expect(clientDb.name).toBe(props.name)
        expect(clientDb.email).toBe(props.email)
        expect(clientDb.address).toBe(props.address)
    })

    test("Should find a client", async () => {
        const input = {
            id: "1",
            name: "client 1",
            email: "email@email.com",
            address: "address",
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const clientRepository = new ClientRepository()

        await ClientModel.create(input)
        const client = await clientRepository.find("1")

        expect(client.id.id).toBe(input.id)
        expect(client.name).toBe(input.name)
        expect(client.email).toBe(input.email)
        expect(client.address).toBe(input.address)
    })
})