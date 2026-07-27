"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

interface Transaction {
  id: string;
  razorpay_payment_id: string;
  created_at: string;
  amount: number;
  submission?: {
    form?: {
      title: string;
    };
  };
}

export function VirtualTransactionTable({ transactions }: { transactions: Transaction[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: transactions.length,
    estimateSize: () => 48, // approximate height of a row
    overscan: 5,
  });

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        No transactions found yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" ref={parentRef}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b">
          <tr>
            <th className="px-4 py-3 font-medium w-1/4">Transaction ID</th>
            <th className="px-4 py-3 font-medium w-1/4">Date</th>
            <th className="px-4 py-3 font-medium w-1/4">Form</th>
            <th className="px-4 py-3 font-medium text-right w-1/4">Amount</th>
          </tr>
        </thead>
        <tbody
          className="divide-y relative"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const tx = transactions[virtualRow.index];
            return (
              <tr
                key={tx.id}
                className="hover:bg-muted/10 transition-colors absolute top-0 left-0 w-full flex items-center"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <td className="px-4 py-3 font-medium text-foreground w-1/4 truncate">
                  {tx.razorpay_payment_id || tx.id.substring(0, 8)}
                </td>
                <td className="px-4 py-3 text-muted-foreground w-1/4 truncate">
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 w-1/4 truncate">
                  {tx.submission?.form?.title || "Unknown Form"}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-500 w-1/4 truncate">
                  + ₹{tx.amount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
