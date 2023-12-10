const deleteUser = async (event: MouseEvent) => {
  const id = $(event.currentTarget!).attr("id");
  $.post(
    `/admin/users/delete/${id}`,
    (
      data: "OK" | "KO",
      status: JQuery.Ajax.SuccessTextStatus,
      xhr: JQuery.jqXHR
    ) => {
      if (status !== "success") alert(`error: ${xhr.status} ${xhr.statusText}`);
      else {
        if (data === "OK") {
          location.href = "/admin/users";
        }
      }
    }
  );
};
