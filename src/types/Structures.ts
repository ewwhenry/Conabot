export interface Student {
  id: string;
  curp: string;
  group: string;
  first_name: string;
  last_names: string;
  full_name: string;
  email: string;
}

export interface Subject {
  subject_name: string;
  teacher_name: string;
  period: string;
  score: number;
}
export interface Semester {
  semester: number;
  cicle: string;
  subjects: Subject[];
}

export interface Output {
  student: Student;
  semesters: Semester[];
}
