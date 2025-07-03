export interface CreateGroupDTO {
  name: string;
  description: string;
}

export interface GroupResponse {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}
