import { User, UserSession } from "@/features/types";
export const createSession = (
  session: UserSession,
  userData: Partial<User>
) => {
  session.isLogged = true;
  session.hasJustLogged = true;
  session.user = userData;
};
