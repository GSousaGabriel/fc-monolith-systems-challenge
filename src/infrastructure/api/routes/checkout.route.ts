import express, { Request, Response } from "express";
import CheckoutFacadeFactory from "../../../modules/checkout/factory/checkout.factory";

export const checkoutRoute = express.Router()

checkoutRoute.post("/", async (req: Request, res: Response) => {
    try {
        const useCase = CheckoutFacadeFactory.create();

        const checkoutDto = {
            clientId: req.body.clientId,
            products: req.body.products.map((p: { productId: any; }) => {
                return {
                    productId: p.productId

                }
            }
            )
        };

        const output = await useCase.execute(checkoutDto)
        res.send(output)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})