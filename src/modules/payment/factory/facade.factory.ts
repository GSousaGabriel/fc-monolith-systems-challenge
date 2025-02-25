import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../use-case/process-payment/process-payment.usecase";

export default class TransactionFacadeFactory {
    static create() {
        const transactionRepository = new TransactionRepository();
        const processPaymentUseCase = new ProcessPaymentUseCase(transactionRepository)
        const paymentFacade = new PaymentFacade(processPaymentUseCase)

        return paymentFacade
    }
}