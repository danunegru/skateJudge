export interface Event {
  id: string;
  name: string;
  veranstalter: string;
  place: string;
  startDate: Date;
  endDate: Date;
  selectedExams: Exam[];
  prueflinge: Pruefling[];
}

export interface Pruefling {
  id: string;
  vorname: string;
  nachname: string;
  verein: string;
  exam: Exam[];
}

export interface Exam {
  id: string;
  name: string;
  category: 'Anfänger' | 'Pflicht' | 'Kür';
}
