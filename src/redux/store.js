import { configureStore } from '@reduxjs/toolkit'
import filter from "./FilterSlice/filterSlice";
import cart from "./FilterSlice/cartSlice"
import pizza from "./FilterSlice/pizzaSlice"

export const store = configureStore({
    reducer: {
        filter,
        cart,
        pizza
    },
})