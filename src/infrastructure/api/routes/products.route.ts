import express, { Request, Response } from "express";
import ProductRepository from "../../../modules/product-adm/repository/product.repository";
import AddProductUseCase from "../../../modules/product-adm/use-case/add-product/add-product.useCase";

export const productsRoute = express.Router()

productsRoute.post("/", async (req: Request, res: Response) => {
    const productRepository = new ProductRepository()
    const useCase = new AddProductUseCase(productRepository)
    try {
        const productDto = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        }

        const output = await useCase.execute(productDto)
        res.send(output)
    } catch (e) {
        res.status(500).send(e)
    }
})