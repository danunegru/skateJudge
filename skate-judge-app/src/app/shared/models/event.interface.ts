export interface Event {
  name: string;
  veranstalter: string;
  place: string;
  startDate: Date |string;
  endDate: Date |string;
  selectedExams: string[];
}