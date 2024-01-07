/* eslint-disable @typescript-eslint/no-unused-vars */

const productDelete = async (event: MouseEvent) => {
  const id = $(event.currentTarget!).attr('id');
  const productRow = $(`#${id}.table-row`);
  $.ajax({
    url: `/admin/products`,
    type: 'DELETE',
    data: { id },
    success: () => {
      toastSuccess('Product Deleted Successfully');
      productRow.remove();
    },
  });
};

const productUpdate = async (event: SubmitEvent) => {
  event.preventDefault();
  const form = $(event.currentTarget!);
  const productId = form.attr('id');

  const formData = new FormData(form[0] as HTMLFormElement);

  formData.append('productId', productId ?? '');
  $.ajax({
    url: `/admin/products/${productId}`,
    type: 'PUT',
    data: formData,
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    success: () => {
      localStorage.setItem('toast', 'update');
      location.href = '/admin/products';
    },
  });
};

const productCreate = async (event: SubmitEvent) => {
  event.preventDefault();
  const form = $(event.currentTarget!);
  const formData = new FormData(form[0] as HTMLFormElement);
  $.ajax({
    url: `/admin/products/create  `,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    success: (res) => {
      localStorage.setItem('toast', 'create');
      location.href = '/admin/products';
    },
  });
};

const toastProduct = localStorage.getItem('toast');
if (toastProduct === 'update') {
  toastSuccess('Product updated successfully');
} else if (toastProduct === 'create') {
  toastSuccess('Product created successfully');
}

localStorage.clear();
