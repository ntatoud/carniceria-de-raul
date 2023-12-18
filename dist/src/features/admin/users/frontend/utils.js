"use strict";
const userDelete = async (event) => {
    const id = $(event.currentTarget).attr('id');
    const userRow = $(`#${id}.table-row`);
    $.ajax({
        url: `/admin/users`,
        type: 'delete',
        data: { id },
        success: () => {
            toastSuccess('User Deleted Successfully');
            userRow.remove();
        },
    });
};
const userUpdate = async (event) => {
    event.preventDefault();
    const form = $(event.currentTarget);
    const userId = form.attr('id');
    const formData = new FormData(form[0]);
    const formDataObject = Array.from(formData.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
    $.ajax({
        url: `/admin/users/${userId}`,
        type: 'PUT',
        data: Object.assign({}, formDataObject),
        success: () => {
            localStorage.setItem('toast', 'update');
            location.href = '/admin/users';
        },
    });
};
const userCreate = async (event) => {
    event.preventDefault();
    const form = $(event.currentTarget);
    const formData = new FormData(form[0]);
    const formDataObject = Array.from(formData.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
    $.ajax({
        url: `/admin/users/create`,
        type: 'POST',
        data: Object.assign({}, formDataObject),
        success: (res) => {
            localStorage.setItem('toast', 'updated');
            location.href = '/admin/users';
        },
    });
};
const toast = localStorage.getItem('toast');
if (toast === 'update') {
    toastSuccess('User updated successfully');
}
else if (toast === 'create') {
    toastSuccess('User created successfully');
}
localStorage.clear();
