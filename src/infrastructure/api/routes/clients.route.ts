import express, { Request, Response } from "express";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";
import AddClientUseCase from "../../../modules/client-adm/use-case/add-client/add-client.usecase";

export const clientsRoute = express.Router()

clientsRoute.post("/", async (req: Request, res: Response) => {
    const clientRepository = new ClientRepository()
    const useCase = new AddClientUseCase(clientRepository)
    try {
        const clientDto = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: req.body.address
        }

        const output = await useCase.execute(clientDto)
        res.send(output)
    } catch (e) {
        res.status(500).send(e)
    }
})