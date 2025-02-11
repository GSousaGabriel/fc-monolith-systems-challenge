

import Order from "../domain/order.entity"
import Product from "../domain/product.entity"
import ProductOrder from "./product.order.model"
import TransactionModel from "../../payment/repository/transaction.model"
import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object"
import ClientOrder from "./client.order.model"
import OrderModel from "./order.model"
import OrderRepository from "./order.repository"
import Client from "../domain/client.entity"
import Address from "../../@shared/domain/value-object/address"

describe('order test unit', () => {

    function createOrder(): Order {
        const address = new Address('street', '12', 'city', 'zipcode', 'state', 'complent')

        const client = new Client({
            id: new Id('1c'),
            name: 'client',
            address: new Address(
                address.street,
                address.number,
                address.city,
                address.zipCode,
                address.state,
                address.complement,
            ),
            email: 'email',
            document: 'doc',
        })
        const product = new Product({ description: 'description1', id: new Id('p1'), name: 'product1', salesPrice: 13 })
        const product1 = new Product({ description: 'description2', id: new Id('p2'), name: 'product2', salesPrice: 13 })
        const products = [product, product1]

        const order = new Order({
            id: new Id('1'),
            status: 'approved',
            client: client,
            products: products
        });

        return order;
    }

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });
        sequelize.addModels([OrderModel, ClientOrder, ProductOrder, TransactionModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    })

    it('should create an order', async () => {
        const order = createOrder();
        const orderRepository = new OrderRepository();
        const result = await orderRepository.addOrder(order);

        expect(result.id.id).toBe('1')
        expect(result.client.id.id).toBe('1c')
        expect(result.client.name).toBe('client')
        expect(result.client.document).toBe('doc')
        expect(result.client.address).toBeUndefined()
        expect(result.products.length).toBe(2)
        expect(result.products.length).toBe(2)
        expect(result.products[0].id.id).toBe('p1')
        expect(result.products[1].id.id).toBe('p2')
    });

    it('should find an order', async () => {
        const order = createOrder();
        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(order);
        const result = await orderRepository.findOrder('1')

        expect(result.id.id).toBe('1')
        expect(result.client.id.id).toBe('1c')
        expect(result.client.name).toBe('client')
        expect(result.client.document).toBe('doc')
        expect(result.client.address).toBeUndefined()
        expect(result.products.length).toBe(2)
        expect(result.products.length).toBe(2)
        expect(result.products[0].id.id).toBe('p1')
        expect(result.products[1].id.id).toBe('p2')
    })
})
