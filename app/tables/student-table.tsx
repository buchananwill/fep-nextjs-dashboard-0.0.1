import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';

export interface Student {
  id: number;
  name: string;
  yearGroup: number;
}

export default function StudentsTable({
  students: students
}: {
  students: Student[];
}) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Id</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>YearGroup</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>
              <Text>{student.id}</Text>
            </TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>
              <Text>{student.yearGroup}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
