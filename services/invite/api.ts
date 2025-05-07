import { api } from "@/utils/axios";
import { Role } from "@/services/user/api";

interface InviteRequest {
  email: string;
  teamIds: string[];
  organizationId: string;
  role: Role;
}

const inviteToOrganisation = async ({ email, teamIds, role, organizationId }: InviteRequest) => {
  const response = await api.post('/api/invite', {
    email,
    teamIds,
    role,
    organizationId
  });
  return response.data;
};

interface AcceptInviteRequest {
  inviteId: string;
}

const acceptInvite = async ({ inviteId }: AcceptInviteRequest) => {
  const response = await api.post('/api/invite/accept', {
    inviteId
  });
  return response.data;
};

const getInviteDetails = async (inviteId: string) => {
  const response = await api.get(`/api/invite`, {
    params: { inviteId }
  });
  return response.data;
};


export { inviteToOrganisation, acceptInvite, getInviteDetails };
