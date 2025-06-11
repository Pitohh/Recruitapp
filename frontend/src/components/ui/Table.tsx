import React from 'react';
import { cn } from '../../utils/cn';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  hoverable?: boolean;
  striped?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, hoverable = true, striped = false, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
    );
  }
);

Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-gray-50', className)} {...props} />
));

TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { striped?: boolean }
>(({ className, striped = false, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      'divide-y divide-gray-200',
      striped && '[&>tr:nth-child(odd)]:bg-gray-50',
      className
    )}
    {...props}
  />
));

TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('bg-gray-50 border-t border-gray-200 font-medium', className)}
    {...props}
  />
));

TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { hoverable?: boolean }
>(({ className, hoverable = true, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-gray-200 transition-colors',
      hoverable && 'hover:bg-gray-50',
      className
    )}
    {...props}
  />
));

TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-gray-500',
      className
    )}
    {...props}
  />
));

TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle', className)}
    {...props}
  />
));

TableCell.displayName = 'TableCell';