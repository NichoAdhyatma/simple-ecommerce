interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    imagePath: string | null
    createdAt: string
    updatedAt: string
    userId: string
    owner: {
        id: string
        name: string
        email: string
        phoneNumber: string
    }
}

interface PaginationData {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
}