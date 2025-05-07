import { api } from "@/utils/axios";

// get one team by id

// create a team
function createTeam(name: string, description: string, organizationId: string) {
  return api.post('/api/team', {
    name,
    description,
    organizationId,
  });
}

interface Team {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  organizationId: string;
  members: {
    userId: string;
    organizationId: string;
    teamId: string;
    userOrg: {
      userId: string;
      organizationId: string;
      role: "ADMIN" | "SALES_REP" | "COACH" | "MANAGER";  // Adjust roles as per your schema
      user: {
        firstName: string;
        lastName: string | null;
        email: string;
        phone: string | null;
        createdAt: string;
        updatedAt: string | null;
        id: string;
        isEmailVerified: boolean;
      };
    };
  }[];
}


async function getTeams(organizationId: string): Promise<Team[]> {
  const response = await api.get('/api/team?organizationId=' + organizationId);
  return response.data
}

async function getTeamById(teamId: string): Promise<Team> {
  const res = await api.get('/api/team/' + teamId);
  return res.data;
}

export { createTeam, getTeams, getTeamById };

