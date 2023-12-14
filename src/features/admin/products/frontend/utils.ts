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
  const formDataObject = Array.from(formData.entries()).reduce(
    (acc: { [key: string]: FormDataEntryValue }, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
  $.ajax({
    url: `/admin/products/${productId}`,
    type: 'PUT',
    data: { productId, ...formDataObject },
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
  const formDataObject = Array.from(formData.entries()).reduce(
    (acc: { [key: string]: FormDataEntryValue }, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
  $.ajax({
    url: `/admin/products/create`,
    type: 'POST',
    data: { ...formDataObject },
    success: (res) => {
      localStorage.setItem('toast', 'update');
      location.href = '/admin/users';
    },
  });
};

$(document).on('load', (event) => {
  const toast = localStorage.getItem('toast');
  if (toast === 'update') {
    toastSuccess('Product updated successfully');
  } else if (toast === 'create') {
    toastSuccess('Product created successfully');
  }
});
