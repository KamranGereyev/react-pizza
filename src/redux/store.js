import { configureStore } from '@reduxjs/toolkit'
import filter from "./FilterSlice/filterSlice";
import cart from "./FilterSlice/cartSlice"

export const store = configureStore({
    reducer: {
        filter,
        cart
    },
})