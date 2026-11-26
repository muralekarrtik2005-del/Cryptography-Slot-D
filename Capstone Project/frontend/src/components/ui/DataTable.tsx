import React from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No security records found',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-xs font-mono">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-left text-xs text-slate-200">
        <thead className="bg-[#0B1120] uppercase font-mono text-[11px] text-slate-400 border-b border-slate-800">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={`px-4 py-3.5 font-semibold ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick && onRowClick(row)}
              className={`hover:bg-slate-800/40 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col, index) => {
                let cellValue: React.ReactNode = null;
                if (typeof col.accessor === 'function') {
                  cellValue = col.accessor(row);
                } else if (col.accessor) {
                  cellValue = row[col.accessor] as unknown as React.ReactNode;
                }
                return (
                  <td key={index} className={`px-4 py-3.5 ${col.className || ''}`}>
                    {cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
