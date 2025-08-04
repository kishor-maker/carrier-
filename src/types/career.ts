export interface CareerEntry {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  achievements: string[];
  responsibilities: string[];
  skills?: string[];
  description?: string;
}

export interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  summary?: string;
}