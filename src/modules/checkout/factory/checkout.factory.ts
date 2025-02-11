import ClientFacadeFactory from "../../client-adm/factory/client.factory";
import InvoiceFacadeFactory from "../../Invoice/factory/facade.factory";
import TransactionFacadeFactory from "../../payment/factory/facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../use-case/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
    static create() {
        const clientFacade = ClientFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();
        const storeFacade = StoreCatalogFacadeFactory.create();
        const orderRepository = new OrderRepository();
        const invoice = InvoiceFacadeFactory.create();
        const payment = TransactionFacadeFactory.create();
        const usecase = new PlaceOrderUseCase(
            clientFacade,
            productFacade,
            storeFacade,
            orderRepository,
            invoice,
            payment);

        return usecase;
    }
}