// import express, { Request, Response } from "express";
// import ProductRepository from "../../../modules/product-adm/repository/product.repository";
// import AddProductUseCase from "../../../modules/product-adm/use-case/add-product/add-product.useCase";

// export const customerRoute = express.Router()

// customerRoute.get("/", async (req: Request, res: Response) => {
//     const customerRepository = new ProductRepository()
//     const useCase = new AddProductUseCase(customerRepository)

//     try {
//         const output = await useCase.execute({})
//         res.send(output)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// customerRoute.post("/", async (req: Request, res: Response) => {
//     const customerRepository = new CustomerRepository()
//     const useCase = new CreateCustomerUseCase(customerRepository)
//     try {
//         const customerDto = {
//             name: req.body.name,
//             address: {
//                 street: req.body.address.street,
//                 city: req.body.address.city,
//                 number: req.body.address.number,
//                 zip: req.body.address.zip
//             }
//         }

//         const output = await useCase.execute(customerDto)
//         res.send(output)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })