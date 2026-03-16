export interface AdminActor {
  id: number;
  fullName: string;
  gender: string | null;
  birthDate: string | null; // ISO date
  nationality: string | null;
  biography: string | null;
  imageUrl: string | null;
}

export interface CreateActorPayload {
  fullName: string;
  gender?: string | null;
  birthDate?: string | null;
  nationality?: string | null;
  biography?: string | null;
  imageUrl?: string | null;
}

export interface UpdateActorPayload {
  fullName?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  nationality?: string | null;
  biography?: string | null;
  imageUrl?: string | null;
}
