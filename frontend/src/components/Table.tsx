import {
  Table as ShadTable,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type TableProps = {
  headers: string[];
  headerClassName?: string;
  children: React.ReactNode;
};

export function Table({ headers, headerClassName = "", children }: TableProps) {
  return (
    <ShadTable>
      <TableHeader className="">
        <TableRow className="hover:bg-transparent">
          {headers.length > 0 &&
            headers.map((header) => {
              return (
                <TableHead key={header} className={headerClassName}>
                  {header}
                </TableHead>
              );
            })}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </ShadTable>
  );
}
