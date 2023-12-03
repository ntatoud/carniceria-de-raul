const deleteUser = async (event: MouseEvent) => {
  const id = $(event.currentTarget!).attr("id");
  $.post(`/admin/users/delete/${id}`, { id }, (data, status, xhr) => {
    if (status !== "success") alert(`error: ${xhr.status} ${xhr.statusText}`);
    else {
      if (data === "OK") {
        location.reload();
      }
    }
  });
};
