import { Transaction } from "@/data/dummyData";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const statusColors = {
    completed: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    refunded: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2 rounded-lg",
          "bg-success/10 text-success"
        )}>
          <ArrowUpRight className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-foreground">{transaction.project.name}</p>
          <p className="text-sm text-muted-foreground">
            Sold to {transaction.buyer.firstName} {transaction.buyer.lastName}
            {' · '}
            {new Date(transaction.orderDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className={statusColors[transaction.status]}>
          {transaction.status}
        </Badge>
        <span className={cn(
          "font-semibold tabular-nums",
          "text-success"
        )}>
          {'+'}${transaction.amount}
        </span>
      </div>
    </div>
  );
}
