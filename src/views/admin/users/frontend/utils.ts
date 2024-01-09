/* eslint-disable @typescript-eslint/no-unused-vars */

const userDelete = async (event: MouseEvent) => {
  const id = $(event.currentTarget!).attr('id');
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

const userUpdate = async (event: SubmitEvent) => {
  event.preventDefault();

  const form = $(event.currentTarget!);
  const userId = form.attr('id');
  const formData = new FormData(form[0] as HTMLFormElement);
  const formDataObject = Array.from(formData.entries()).reduce(
    (acc: { [key: string]: FormDataEntryValue }, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
  $.ajax({
    url: `/admin/users/${userId}`,
    type: 'PUT',
    data: formDataObject,
    success: () => {
      localStorage.setItem('toast', 'update');
      location.href = '/admin/users';
    },
  });
};

const userCreate = async (event: SubmitEvent) => {
  event.preventDefault();
  const form = $(event.currentTarget!);
  const formData = new FormData(form[0] as HTMLFormElement);
  const formDataObject = Array.from(formData.entries()).reduce(
    (acc: { [key: string]: FormDataEntryValue }, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
  $.ajax({
    url: `/admin/users/create`,
    type: 'POST',
    data: formDataObject,
    success: (res) => {
      localStorage.setItem('toast', 'create');
      location.href = '/admin/users';
    },
  });
};

const toastUser = localStorage.getItem('toast');
if (toastUser === 'update') {
  toastSuccess('Usuario actualizado');
} else if (toastUser === 'create') {
  toastSuccess('Usuario creado');
}
localStorage.clear();
