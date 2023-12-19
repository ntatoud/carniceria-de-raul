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
  $.ajax({
    url: `/admin/users/${userId}`,
    type: 'PUT',
    data: formData,
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
  $.ajax({
    url: `/admin/users/create`,
    type: 'POST',
    data: formData,
    success: (res) => {
      localStorage.setItem('toast', 'updated');
      location.href = '/admin/users';
    },
  });
};

const toastUser = localStorage.getItem('toast');
if (toastUser === 'update') {
  toastSuccess('User updated successfully');
} else if (toastUser === 'create') {
  toastSuccess('User created successfully');
}
localStorage.clear();
