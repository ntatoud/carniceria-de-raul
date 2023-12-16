const cartProductDelete = async (event: MouseEvent) => {
  event.preventDefault();
  const id = $(event.currentTarget!).attr('id');
  const productRow = $(`#${id}.product-row`);
  $.ajax({
    url: `/order/cart`,
    type: 'DELETE',
    data: { id },
    success: (res) => {
      $('.cart-button .nb-products').html(res.newCartSize);
      $('.cart-price .total-price').html(
        ` <div class="normal-price">
            ${res.newCartTotalPrice.toFixed(2)} €
          </div>
      ${
        res.newCartTotalSalePrice
          ? `<div class="sale-price"> ${res.newCartTotalSalePrice.toFixed(
              2
            )} €</div>`
          : ''
      }
    </div>`
      );
      productRow.attr('style', 'opacity: 0');

      setTimeout(() => {
        productRow.remove();
      }, 200);
      if (res.newCartSize === 0) {
        location.reload();
      }
    },
  });
};

const cartProductAdd = async (event: SubmitEvent) => {
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
    url: '/order/cart',
    type: 'PUT',
    data: { productId, ...formDataObject },
    success: (res) => {
      $('.cart-button .nb-products').html(res.newCartSize);
      toastSuccess('Product added to cart');
    },
  });
};

const cartProductUpdate = async (event: MouseEvent) => {
  const button = $(event.currentTarget!);
  const cartProductId = button.attr('id');
  const productId = cartProductId?.split('-')[0];

  const productRow = $(event.currentTarget!).parents(
    `#${cartProductId}.product-row`
  );
  const oldQuantity = productRow.find('.quantity').val();

  const newQuantity = updateCartProductValue(
    button as JQuery<HTMLButtonElement>
  );
  event.preventDefault();
  const diff = newQuantity && oldQuantity ? +newQuantity - +oldQuantity : 0;
  const weight = $(event.currentTarget!).attr('id')?.split('-').pop();

  $.ajax({
    url: '/order/cart',
    type: 'PUT',
    data: {
      productId: productId,
      weight: weight,
      quantity: diff,
    },
    success: (res) => {
      productRow.find('.total-price').html(
        ` <div class="normal-price">
            ${res.newProductTotalPrice?.toFixed(2)} €
          </div>
        ${
          res.newProductTotalSalePrice
            ? `<div class="sale-price"> ${res.newProductTotalSalePrice.toFixed(
                2
              )} €</div>`
            : ''
        }
    </div>`
      );
      $('.cart-price .total-price').html(
        ` <div class="normal-price">
              ${res.newCartTotalPrice?.toFixed(2)} €
            </div>
        ${
          res.newCartTotalSalePrice
            ? `<div class="sale-price"> ${res.newCartTotalSalePrice.toFixed(
                2
              )} €</div>`
            : ''
        }
    </div>`
      );
    },
  });
};

const updateCartProductValue = (button: JQuery<HTMLButtonElement>) => {
  const operation = button.hasClass('button-plus') ? 1 : -1;

  const quantityInput = button
    .parents(`#${button.attr('id')}.product-row`)
    .find('.quantity')
    .first();
  const currentQuantity = +quantityInput.val()!;

  // Update the value
  quantityInput.val(currentQuantity + operation);

  // Update the state of the decrease button
  if (button.parents('.product-row').find('.quantity').val() === '1') {
    button
      .parents('.product-row')
      .find('.button-minus')
      .attr('style', 'visibility: hidden')
      .prop('disabled', true);
  } else {
    button
      .parents('.product-row')
      .find('.button-minus')
      .attr('style', 'visibility: visible')
      .prop('disabled', false);
  }
  return quantityInput.val();
};
const singleProducts = $('.product-row').has('.quantity[value=1]');
singleProducts.find('.minus-button').hide();
