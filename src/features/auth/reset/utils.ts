export const generateResetLink = (token: string): string => {
  return `${process.env.API_URL}/auth/update/index?token=${token}`;
};
