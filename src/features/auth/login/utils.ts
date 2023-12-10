import { toastSuccess } from '../../../components/toast';
import { User, UserSession } from '@/features/types';
export const createSession = (
    session: UserSession,
    userData: Partial<User>
) => {
    session.isLogged = true;
    session.toast = toastSuccess({ content: 'You are now connected' });
    session.user = userData;
};
