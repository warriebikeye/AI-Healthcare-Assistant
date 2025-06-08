export interface Symptom {
  name: string;
  severity: number;
}

export interface Appointment {
  date: string;
  doctorId: string;
}

export interface CarePlan {
  goals: string[];
  actions: string[];
}
