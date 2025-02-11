import { Sequelize } from "sequelize-typescript";
import OrderModel from "../repository/order.model";
import ProductModel from "../../product-adm/repository/product.model";
import ProductStoreModel from "../../store-catalog/repository/product.model";
import ProductOrder from "../repository/product.order.model";
import ClientOrder from "../repository/client.order.model";
import TransactionModel from "../../payment/repository/transaction.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import { ClientModel } from "../../client-adm/repository/client.model";
import InvoiceModel from "../../Invoice/repository/invoice.model";
import ItemModel from "../../Invoice/repository/item.model";
import ClientFacadeFactory from "../../client-adm/factory/client.factory";
import Address from "../../@shared/domain/value-object/address";
import CheckoutFacadeFactory from "../factory/checkout.factory";
import { vi } from "vitest";
import Product from "../domain/product.entity";

const product = new Product({
    id: new Id("2"),
    name: "product 1",
    description: "product 1 description",
    salesPrice: 10,
})

const mockRepository = () => {
    return {
        find: vi.fn().mockReturnValue(Promise.resolve(product)),
        findAll: vi.fn().mockReturnValue(Promise.resolve([product]))
    }
}
describe('client adm facade test unit', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });
        await sequelize.addModels([
            OrderModel,
            ProductOrder,
            ClientOrder,
            ProductModel,
            ProductStoreModel,
            TransactionModel,
            ClientModel,
            ItemModel,
            InvoiceModel
        ]);
        sequelize.connectionManager.initPools();
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test('should add an order', async () => {
        const clientUsecase = ClientFacadeFactory.create();
        const input = {
            id: "1",
            name: 'nome',
            document: 'doc',
            email: 'x@doc.com',
            address: new Address('street', '1', 'city', 'zipcode', 'state', 'complement')
        }

        await clientUsecase.add(input);
        const client = await clientUsecase.find({ id: '1' });

        const useCase = CheckoutFacadeFactory.create();

        const mockProductFacade = {
            checkStock: vi.fn(({ productId }: { productId: string }) =>
                Promise.resolve({
                    productId,
                    stock: productId === "1" ? 0 : 1
                }))
        }
        //@ts-expect-error - force set clientFacade
        useCase["_productFacade"] = mockProductFacade

        vi
            //@ts-expect-error - spy on private method
            .spyOn(useCase, "getProduct")
            //@ts-expect-error - spy on private method
            .mockImplementation((productId: keyof typeof products) => {
                return products[0];
            });

        const findProductUseCase = mockRepository()
        const products = await findProductUseCase.findAll();

        const listProduct = products.map((p: Product) => {
            return { productId: p.id.id }
        })

        const result = await useCase.execute({ clientId: client.id, products: listProduct });
        expect(result.id).toBeDefined();
        expect(result.invoiceId).toBeDefined();
        expect(result.products.length).toBe(1)
    });
});