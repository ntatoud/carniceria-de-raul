const deleteProduct = async (event: MouseEvent) => {
  const id = $(event.currentTarget!).attr("id");
  $.post(`/admin/products/delete/${id}`, (data, status, xhr) => {
    if (status !== "success") alert(`error: ${xhr.status} ${xhr.statusText}`);
    else {
      if (data === "OK") {
        location.reload();
      }
    }
  });
};
