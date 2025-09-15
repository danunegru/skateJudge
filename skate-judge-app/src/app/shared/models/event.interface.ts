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
  exam: { id: string; name: string; }[];
  hidden?: boolean; // Add this optional property
  eventId?: string; // Link to parent event
  createdAt?: string; // When athlete was created
}

export interface Exam {
  id: string;
  name: string;
  category: 'Anfänger' | 'Pflicht' | 'Kür';
}
