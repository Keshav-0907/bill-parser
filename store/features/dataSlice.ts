import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    invoices: [] as any[],
    customers: [] as any[],
    products: [] as any[],
};

export const data = createSlice({
    name: "data",
    initialState: initialState,
    reducers: {
        addInvoice: (state, action: PayloadAction<any[]>) => {
            state.invoices.push(...action.payload); // Add multiple invoices
        },
        addCustomer: (state, action: PayloadAction<any[]>) => {
            state.customers.push(...action.payload); // Add multiple customers
        },
        addProduct: (state, action: PayloadAction<any[]>) => {
            state.products.push(...action.payload); // Add multiple products
        },
    },
});

export const { addInvoice, addCustomer, addProduct } = data.actions;
export default data.reducer;
