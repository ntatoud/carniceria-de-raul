const orderDelete = async (event: MouseEvent) => {
  const id = $(event.currentTarget!).attr('id');
  const orderRow = $(`#${id}.table-row`);
  $.ajax({
    url: `/admin/orders`,
    type: 'delete',
    data: { id },
    success: () => {
      toastSuccess('Order Deleted Successfully');
      orderRow.remove();
    },
  });
};
