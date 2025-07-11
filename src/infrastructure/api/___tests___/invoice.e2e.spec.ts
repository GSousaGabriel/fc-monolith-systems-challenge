import { Sequelize } from "sequelize-typescript";
import express, { Express } from "express";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../config-migrations/migrator";
import { checkoutRoute } from "../routes/checkout.route";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { productsRoute } from "../routes/products.route";
import { clientsRoute } from "../routes/clients.route";
import ProductModelAdm from "../../../modules/product-adm/repository/product.model";
import ProductModel from "../../../modules/store-catalog/repository/product.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import InvoiceModel from "../../../modules/Invoice/repository/invoice.model";
import ItemModel from "../../../modules/Invoice/repository/item.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import ClientOrder from "../../../modules/checkout/repository/client.order.model";
import ProductOrder from "../../../modules/checkout/repository/product.order.model";
import { invoiceRoute } from "../routes/invoice.route";

describe("E2E test for invoice", () => {
  const app: Express = express();
  app.use(express.json());
  app.use("/clients", clientsRoute);
  app.use("/products", productsRoute);
  app.use("/checkout", checkoutRoute);
  app.use("/invoice", invoiceRoute);
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([
      OrderModel,
      ClientOrder,
      ProductOrder,
      ClientModel,
      ProductModelAdm,
      ProductModel,
      TransactionModel,
      InvoiceModel,
      ItemModel,
    ]);
    await sequelize.sync({ alter: true });
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should get an invoice", async () => {
    await request(app)
      .post("/clients")
      .send({
        id: "1",
        name: "jose",
        email: "email@email",
        document: "123",
        address: {
          street: "street",
          number: "123",
          city: "city",
          zipCode: "zipCode",
          state: "state",
          complement: "complement",
        },
      });
    await request(app).post("/products").send({
      id: "2",
      name: "product",
      description: "description",
      purchasePrice: 100,
      stock: 10,
    });
    const responseCheckout = await request(app)
      .post("/checkout")
      .send({
        clientId: "1",
        products: [
          {
            productId: "2",
          },
        ],
      });

    const response = await request(app).get(
      `/invoice/${responseCheckout.body.invoiceId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body.name).toBe("jose");
    expect(response.body.document).toBe("123");
    expect(response.body.items[0].name).toBe("product");
    expect(response.body.items[0].price).toBe(100);
    expect(response.body.createdAt).toBeTruthy();
  });
});
