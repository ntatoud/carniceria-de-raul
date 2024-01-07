const toastSuccess = (content: string) => {
  const uniqueId = Date.now();
  $('.toast-container')
    .append(`<div class='toast show toast-success fade-in' id="${uniqueId}"> 
                <div class='toast-icon'>
                    <i class='bi bi-check-circle-fill'></i>
                </div>
                <div class='toast-body'>
                    <div class='toast-title d-flex justify-content-between'>
                        Success
                        <button type='button' class='btn-close' data-bs-dismiss='toast'></button>
                    </div>
                    <div class='toast-content'>
                        ${content}
                    </div>
                </div>
            </div>`);

  setTimeout(() => {
    $(`.toast-container #${uniqueId}.toast`)
      .addClass('fade-out')
      .removeClass('fade-in');
  }, 2800);
  setTimeout(() => {
    $(`.toast-container #${uniqueId}.toast`).remove();
  }, 3000);
};

const toastError = (content: string) => {
  const uniqueId = Date.now();
  $('.toast-container')
    .append(`<div class='toast show toast-error fade-in' id="${uniqueId}"> 
                <div class='toast-icon'>
                    <i class='bi bi-x-circle-fill'></i>
                </div>
                <div class='toast-body'>
                    <div class='toast-title d-flex justify-content-between'>
                        Success
                        <button type='button' class='btn-close' data-bs-dismiss='toast'></button>
                    </div>
                    <div class='toast-content'>
                        ${content}
                    </div>
                </div>
            </div>`);

  setTimeout(() => {
    $(`.toast-container #${uniqueId}.toast`)
      .addClass('fade-out')
      .removeClass('fade-in');
  }, 4800);
  setTimeout(() => {
    $(`.toast-container #${uniqueId}.toast`).remove();
  }, 5000);
};
