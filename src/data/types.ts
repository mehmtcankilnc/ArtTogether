export type Project = {
  projectId: string;
  projectName: string;
  invitationLink: string;
  deepLink: string;
  createdAt: Date;
  updatedAt: Date;
  isOwner: boolean;
};

export type CreateProjectDto = {
  projectName: string;
  projectWidth: string;
  projectHeight: string;
  backgroundColor: string;
};
