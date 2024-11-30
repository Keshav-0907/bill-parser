export const pdfPrompt = `Generate a JSON response for the given PDF file. Include the following fields: "Invoices", "Products", and "Customers". Only share the json as the response.  The JSON response should be in the following format:
   "Invoices": {
        serial_number: 1, 
        customer_name: "", 
        product_name: "", 
        quantity: "",
        tax: "", ( GST tax percentage )
        total_amount: "", 
        date: ""
   },
   Products :{
        product_name: "", 
        quantity: "", 
        unit_price: "", 
        tax: "", ( GST tax percentage )
        price_with_tax: ""
   }, 
   Customers: {
        customer_name: "", 
        phone_number: "", 
        total_purchase_amount: 
  }. Invoces, Products & customers should be an array of objects.`;
