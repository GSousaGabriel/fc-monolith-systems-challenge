import express, { Request, Response } from "express";
import {default as ProductAdmRepository} from "../../../modules/product-adm/repository/product.repository";
import {default as AddProductAdmUseCase} from "../../../modules/product-adm/use-case/add-product/add-product.useCase";
import AddProductUseCase from "../../../modules/store-catalog/use-case/add-product/add-product.useCase";
import ProductRepository from "../../../modules/store-catalog/repository/product.repository";

export const productsRoute = express.Router()

productsRoute.post("/", async (req: Request, res: Response) => {
    const productAdmRepository = new ProductAdmRepository()
    const productRepository = new ProductRepository()
    const useCaseAdm = new AddProductAdmUseCase(productAdmRepository)
    const useCase = new AddProductUseCase(productRepository)

    try {
        const productAdmDto = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        }

        const output = await useCaseAdm.execute(productAdmDto)

        const productDto = {
            id: output.id,
            name: output.name,
            description: output.description,
            salesPrice: output.purchasePrice,
            stock: output.stock
        }
        await useCase.execute(productDto)

        res.send(output)
    } catch (e) {
        res.status(500).send(e)
    }
})