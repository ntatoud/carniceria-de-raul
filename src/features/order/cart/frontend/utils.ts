const cartProductDelete = async (event: MouseEvent) => {
  event.preventDefault();
  const uniqueID = Date.now();
  const id = $(event.currentTarget!).attr('id');
  const productRow = $(`#${id}.product-row`);
  $.ajax({
    url: `/order/cart`,
    type: 'DELETE',
    data: { id },
    success: () => {
      productRow.remove();
      toastSuccess('Product removed from cart');
    },
  });
};

const cartProductAdd = async (event: SubmitEvent) => {
  event.preventDefault();
  const form = $(event.currentTarget!);
  const uniqueID = Date.now();
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
    url: '/order/cart',
    type: 'PUT',
    data: { productId, ...formDataObject },
    success: (res) => {
      toastSuccess('Product added to cart');
    },
  });
};
