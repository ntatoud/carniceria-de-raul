export const toastEmpty = () => {
    return {
        isVisible: false,
        title: '',
        content: '',
        type: 'default',
    };
};
export const toastSuccess = ({ title = 'Success', content, }) => {
    return {
        isVisible: true,
        title: title,
        content: content,
        type: 'success',
    };
};
export const toastError = ({ title = 'Error', content, }) => {
    return {
        isVisible: true,
        title: title,
        content: content,
        type: 'error',
    };
};
export const toastDispatch = (req) => {
    const toast = req.session.toast;
    req.session.toast = toastEmpty();
    return toast;
};
