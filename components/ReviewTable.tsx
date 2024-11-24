import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockData = {
  Invoices: [
    {
      "Serial Number": 1,
      "Customer Name": "Navya Sri",
      "Product Name": "YONEX ZR 100 LIGHT Racket",
      Quantity: 7,
      Tax: 0,
      "Total Amount": 179200,
      Date: "12 Nov 2024",
    },
    {
      "Serial Number": 2,
      "Customer Name": "Navya Sri",
      "Product Name": "Matrix and Pillows",
      Quantity: 1,
      Tax: 8115.25,
      "Total Amount": 53200,
      Date: "12 Nov 2024",
    },
  ],
  Products: [
    {
      "Product Name": "YONEX ZR 100 LIGHT Racket",
      Quantity: 7,
      "Unit Price": 25600,
      Tax: 0,
      "Price with Tax": 179200,
    },
    {
      "Product Name": "Matrix and Pillows",
      Quantity: 1,
      "Unit Price": 45084.75,
      Tax: 8115.25,
      "Price with Tax": 53200,
    },
  ],
  Customers: [
    {
      "Customer Name": "Navya Sri",
      "Phone Number": "8965236147",
      "Total Purchase Amount": 232400,
    },
  ],
};

const ReviewTable = ({geminiResponse}) => {
  return (
    <div className="py-10">
      {/* Invoices Table */}
      <div className="flex flex-col mb-8">
        <div className="text-xl font-semibold">Invoices</div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {geminiResponse.Invoices.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell>{invoice["customer_name"]}</TableCell>
                <TableCell>{invoice["product_name"]}</TableCell>
                <TableCell>{invoice["quantity"]}</TableCell>
                <TableCell>{invoice["tax"]}</TableCell>
                <TableCell>{invoice["total_amount"]}</TableCell>
                <TableCell>{invoice["date"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Products Table */}
      <div className="flex flex-col mb-8">
        <div className="text-xl font-semibold">Products</div>
        <Table>
          <TableCaption>A list of your products.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Price with Tax</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {geminiResponse.Products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product["product_name"]}</TableCell>
                <TableCell>{product["quantity"]}</TableCell>
                <TableCell>{product["unit_price"]}</TableCell>
                <TableCell>{product["tax"]}</TableCell>
                <TableCell>{product["price_with_tax"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Customers Table */}
      <div className="flex flex-col">
        <div className="text-xl font-semibold">Customers</div>
        <Table>
          <TableCaption>A list of your customers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Total Purchase Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {geminiResponse.Customers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer["customer_name"]}</TableCell>
                <TableCell>{customer["phone_number"]}</TableCell>
                <TableCell>{customer["total_purchase_amount"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReviewTable;
