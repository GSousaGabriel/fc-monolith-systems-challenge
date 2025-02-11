import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import request from 'supertest'
import { Umzug } from "umzug";
import { migrator } from "../config-migrations/migrator";
import { checkoutRoute } from "../routes/checkout.route";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { productsRoute } from "../routes/products.route";
import { clientsRoute } from "../routes/clients.route";
import { default as ProductModelAdm } from "../../../modules/product-adm/repository/product.model";
import ProductModel from "../../../modules/store-catalog/repository/product.model";

describe('E2E test for checkout', () => {
    const app: Express = express()
    app.use(express.json())
    app.use("/clients", clientsRoute)
    app.use("/products", productsRoute)
    app.use("/checkout", checkoutRoute)
    let sequelize: Sequelize;
    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([ClientModel, ProductModelAdm, ProductModel])
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

    it('should create a checkout', async () => {
        await request(app)
            .post('/clients')
            .send({
                "id": "1",
                "name": "jose",
                "email": "email@email",
                "document": "123",
                "address": {
                    "street": "street",
                    "number": "123",
                    "city": "city",
                    "zipCode": "zipCode",
                    "state": "state",
                    "complement": "complement"
                }
            });
        await request(app)
            .post('/products')
            .send({
                "id": "2",
                "name": "product",
                "description": "description",
                "purchasePrice": 100,
                "stock": 10
            });
        const response = await request(app)
            .post('/checkout')
            .send({
                "clientId": "1",
                "products": [
                    {
                        "productId": "2"
                    }
                ]
            });

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined()
        expect(response.body.invoiceId).toBeDefined()
        expect(response.body.status).toBe('approved')
    })
});