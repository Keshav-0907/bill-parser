"use client";
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
import { useSelector } from "react-redux";

// {
//   "product_name": "GEMS CHOCLATE POUCH",
//   "quantity": 191,
//   "unit_price": 4.76,
//   "tax": 5,
//   "price_with_tax": 5000
// }

const Products = () => {
  const ProductsData = useSelector((state) => state.dataReducer.products);
  console.log("ProductsData", ProductsData);

  return (
    <div className="p-10 flex gap-10 flex-col">
      <div className="text-3xl font-semibold">Products</div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S. No</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead className="text-right">
              Total Amount ( with tax ){" "}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ProductsData?.length > 0 ? (
            ProductsData.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.unit_price}</TableCell>
                <TableCell>{product.tax}%</TableCell>
                <TableCell className="text-right">
                  ₹{product.price_with_tax.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No product found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Products;
