import api from "@/utils/axios";
import { Role } from "@/services/user/api";

export interface Organisation {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

// User inside the organization
export interface OrgUser {
  userId: string;
  organizationId: string;
  role: Role;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// Response format for getOrgbyId
export interface GetOrgByIdResponse {
  organization: Organisation & {
    users: OrgUser[];
  };
}


// Mapping function to ensure all required fields are present
export const mapToOrganization = (apiOrg: any): Organisation => {
  return {
    id: apiOrg.id,
    name: apiOrg.name,
    createdAt: apiOrg.createdAt,
    updatedAt: apiOrg.updatedAt,
    phone: apiOrg.phone || '',
    address: apiOrg.address || '',
    city: apiOrg.city || '',
    state: apiOrg.state || '',
    zip: apiOrg.zip || '',
    country: apiOrg.country || ''
  };
};

export const createOrganisation = async (
  name: string
): Promise<Organisation> => {
  const response = await api.post("/api/organisation", { name });
  // Extract the organisation and map it to ensure it has all required fields
  return mapToOrganization(response.data.organisation);
};

export const getOrgs = async (): Promise<{ userId: string; organizationId: string; role: string; organization: Organisation }[]> => {
  const res = await api.get("/api/organisation");
  return res.data;
}

export const inviteToOrganisation = async (
  email: string,
  role: Role,
  organizationId: string,
  teamIds: string[]
): Promise<any> => {
  const response = await api.post("/api/invite", {
    email,
    role,
    organizationId,
    teamIds,
  });
  return response.data;
};

export const getOrgbyId = async (
  id: string
): Promise<GetOrgByIdResponse> => {
  const response = await api.get(`/api/organisation/${id}`);
  return response.data;
}