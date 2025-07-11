import express, { Request, Response } from "express";
import InvoiceRepository from "../../../modules/Invoice/repository/invoice.repository";
import FindInvoiceUseCase from "../../../modules/Invoice/use-case/find-invoice/find-invoice.useCase";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  const invoiceRepository = new InvoiceRepository();
  const useCase = new FindInvoiceUseCase(invoiceRepository);
  try {
    const output = await useCase.execute({id: req.params.id});
    res.send(output);
  } catch (e) {
    res.status(500).send(e);
  }
});
