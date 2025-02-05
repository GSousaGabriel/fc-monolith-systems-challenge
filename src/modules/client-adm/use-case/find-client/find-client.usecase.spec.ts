import { vi } from 'vitest'
import Client from '../../domain/client.entity'
import Id from '../../../@shared/domain/value-object/id.value-object'
import FindClientUseCase from './find-client.usecase'

const client = new Client({
    id: new Id("1"),
    name: "client",
    email: "email@email.com",
    address: "address client",

})

const mockRepository = () => {
    return {
        add: vi.fn(),
        find: vi.fn().mockReturnValue(Promise.resolve(client))
    }
}

describe("Find client usecase unit test", () => {
    it("Should find a client", async () => {
        const productRepository = mockRepository()
        const useCase = new FindClientUseCase(productRepository)

        const result = await useCase.execute({ id: client.id.id })

        expect(result.id).toBeDefined()
        expect(result.name).toBe(client.name)
        expect(result.email).toBe(client.email)
        expect(result.address).toBe(client.address)
        expect(result.createdAt).toBe(client.createdAt)
        expect(result.updatedAt).toBe(client.updatedAt)
    })
})