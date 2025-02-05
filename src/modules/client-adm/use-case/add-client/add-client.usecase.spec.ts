import { vi } from 'vitest'
import AddClientUseCase from './add-client.usecase'

const mockRepository = () => {
    return {
        add: vi.fn(),
        find: vi.fn()
    }
}

describe("Add client usecase unit test", () => {
    it("Should add a client", async () => {
        const productRepository = mockRepository()
        const useCase = new AddClientUseCase(productRepository)

        const input = {
            name: "client",
            email: "email@email.com",
            address: "address"
        }

        const result = await useCase.execute(input)

        expect(productRepository.add).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toBe(input.name)
        expect(result.email).toBe(input.email)
        expect(result.address).toBe(input.address)
    })
})