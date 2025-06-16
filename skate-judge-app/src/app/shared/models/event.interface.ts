export interface Event {
  id: string; // Make id required, not optional
  name: string;
  veranstalter: string;
  place: string;
  startDate: Date;
  endDate: Date;
  selectedExams:Exam[];
  prueflinge: Pruefling[];
}

export interface Pruefling {
  id?: string;
  name: string;
  verein: string;
  exam: Exam[];
}

export interface Exam {
  id: string;
  name: string;
  category: 'Anfänger' | 'Pflicht' | 'Kür';
}
