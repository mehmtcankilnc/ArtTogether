export type Project = {
  projectId: string;
  projectName: string;
  invitationLink: string;
  deepLink: string;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
};

export type ProjectDetails = {
  width: string;
  height: string;
  backgroundColor: string;
  swatches: string[];
} & Project;

export type CreateProjectDto = {
  projectName: string;
  projectWidth: string;
  projectHeight: string;
  backgroundColor: string;
};

export type UpdateProjectDto = {
  projectName?: string;
  projectWidth?: string;
  projectHeight?: string;
  backgroundColor?: string;
  swatches?: string[];
};
