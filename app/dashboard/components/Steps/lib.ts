import {mockEndUsers} from "./mockEndUsers";

export const getUsersAtStep = (stepId: number) => {
  return mockEndUsers.filter((user) => user.currentStep === stepId);
};
