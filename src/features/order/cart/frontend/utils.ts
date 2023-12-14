const deleteCartProduct = async (event: MouseEvent) => {
  event.preventDefault();
  const uniqueID = Date.now();
  const id = $(event.currentTarget!).attr('id');
  const productRow = $(`#${id}.product-row`);
  productRow.remove();
  $.ajax({
    url: `/order/cart`,
    type: 'DELETE',
    data: { id },
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
