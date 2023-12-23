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

  return quantityInput.val();
};

$(`.product-card.disabled button, .product-card.disabled select`).prop(
  'disabled',
  $('.product-card').hasClass('disabled')
);

const cookiesAssertAllowed = (event: MouseEvent) => {
  const areCookiesAllowed = !$(event.currentTarget!).hasClass(
    'cookies-redirect'
  );
  if (!areCookiesAllowed) {
    event.preventDefault();
    if (!$('main').find('.offcanvas').length) {
      cookieBannerShow();
    }
    $('.offcanvas').attr('style', 'transform: scale(1.2);');
    setTimeout(() => {
      $('.offcanvas').removeAttr('style');
    }, 200);
  }
};
