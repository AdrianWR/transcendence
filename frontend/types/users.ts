import { Key } from "react"

export type User = {
    id: Key
    name: String
    email: String
    website: String
    address: {
        city: String
    }
}