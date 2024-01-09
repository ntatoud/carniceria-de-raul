// eslint-disable-next-line @typescript-eslint/no-unused-vars
const populateModal = (event: MouseEvent) => {
  const [itemId, itemName] = $(event.currentTarget!).attr('id')?.split('_') ?? [
    '0',
    'unknown',
  ];

  $('.modal-delete-confirm button.confirm').attr('id', itemId!);

  $('.modal-delete-confirm .modal-header').prepend(`<h5
    class="modal-title"
  >Esta apunto de borrar <b>${itemName}</b></h5>`);
};
