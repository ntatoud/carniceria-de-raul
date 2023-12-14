const updateState = (newQuantity: number, buttonMinus: JQuery<HTMLElement>) => {
  buttonMinus.prop(
    'disabled',
    (newQuantity <= 2 || newQuantity === 1) && !(newQuantity > 1)
  );
};

const updateValue = (event: MouseEvent) => {
  const operation = $(event.currentTarget!).hasClass('button-plus') ? 1 : -1;
  const id = $(event.currentTarget!).parents('.product-card').attr('id');
  const quantityInput = $(`.product-card#${id} .quantity`);
  const currentQuantity = +quantityInput.val()!;

  // Update the value
  quantityInput.val(currentQuantity + operation);

  // Update the state of the decrease button
  updateState(+quantityInput.val()!, $(`.product-card#${id} .button-minus`));
};

$(`.product-card.disabled button, .product-card.disabled select`).prop(
  'disabled',
  $('.product-card').hasClass('disabled')
);

const notLoggedAction = (event: MouseEvent) => {
  event.preventDefault();
};

const submitForm = (event: SubmitEvent) => {
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
    success: () => {
      $('.toast-container').append(
        `<div class='toast show toast-success fade-in' id="${uniqueID}"> \
                  <div class='toast-icon'>\
                <i class='bi bi-check-circle-fill'\
                ></i>\
              </div>\
              <div class='toast-body'>\
                <div class='toast-title d-flex justify-content-between'>\
                  Success\
                  <button type='button' class='btn-close' data-bs-dismiss='toast'></button>\
                </div>\
                <div class='toast-content'> Product added to cart</div>\
              </div>\
            </div>`
      );
      setTimeout(() => {
        $(`.toast-container #${uniqueID}.toast`)
          .addClass('fade-out')
          .removeClass('fade-in');
      }, 4800);
      setTimeout(() => {
        $(`.toast-container #${uniqueID}.toast`).remove();
      }, 5000);
    },
  });
};
