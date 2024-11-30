'use client'
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

const Invoice = () => {
  const InvoiceData = useSelector((state) => state.dataReducer.invoices);

  return (
    <div className="p-10 flex gap-10 flex-col">
      <div className="text-3xl font-semibold">Invoices</div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Invoice #</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Product Details</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="w-[150px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {InvoiceData && InvoiceData.length > 0 ? (
            InvoiceData.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{invoice.serial_number}</TableCell>
                <TableCell>{invoice.customer_name}</TableCell>
                <TableCell>
                  <ul className="list-disc pl-4">
                    {invoice.product_name.map((product, i) => (
                      <li key={i}>{product} - Qty: {invoice.quantity[i]}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>${invoice.tax}</TableCell>
                <TableCell className="text-right">${invoice.total_amount}</TableCell>
                <TableCell>{invoice.date}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No invoices found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Invoice;
