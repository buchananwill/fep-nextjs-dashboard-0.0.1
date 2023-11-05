import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text
} from '@tremor/react';
import { ArrayDTO, StudentDTO } from '../api/dto-interfaces';

export default function StudentsTable({
  students: { allItems: students }
}: {
  students: ArrayDTO<StudentDTO>;
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
