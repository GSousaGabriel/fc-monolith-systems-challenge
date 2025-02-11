import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import ProductModel from "../../../modules/product-adm/repository/product.model"
import request from 'supertest'
import { Umzug } from "umzug";
import { migrator } from "../config-migrations/migrator";
import { productsRoute } from "../routes/products.route";

describe("product api test", () => {
    const app: Express = express()
    app.use(express.json())
    app.use("/products", productsRoute)
    let sequelize: Sequelize;
    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([ProductModel])
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

    test("Should create a product with Id", async () => {
        const props = {
            id: "1",
            name: "product 1",
            description: "product 1 description",
            purchasePrice: 10,
            stock: 10
        }

        const response = await request(app).post("/products").send(props)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(props.id)
        expect(response.body.name).toBe(props.name)
        expect(response.body.description).toBe(props.description)
        expect(response.body.purchasePrice).toBe(props.purchasePrice)
        expect(response.body.stock).toBe(props.stock)
        expect(response.body.createdAt).toBeTruthy()
    })
})