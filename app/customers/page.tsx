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
import { useSelector, UseSelector } from "react-redux";

const Customers = () => {
  const CustomerData = useSelector((state) => state.dataReducer.customers);
  console.log("CustomerData", CustomerData);
  return (
    <div className="p-10 flex gap-10 flex-col">
      <div className="text-3xl font-semibold">Customers</div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.No</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Total Purchase Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {CustomerData?.length > 0 ? (
            CustomerData.map((customer, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{customer.customer_name}</TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell className="text-right">
                  ₹{customer.total_purchase_amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No customers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Customers;
