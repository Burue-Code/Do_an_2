export interface AdminDirector {
  id: number;
  fullName: string;
  birthDate: string | null;
  awards: string | null;
  biography: string | null;
}

export interface CreateDirectorPayload {
  fullName: string;
  birthDate?: string | null;
  awards?: string | null;
  biography?: string | null;
}

export interface UpdateDirectorPayload {
  fullName?: string | null;
  birthDate?: string | null;
  awards?: string | null;
  biography?: string | null;
}
