const infosPost = async (event: SubmitEvent) => {
  event.preventDefault();
  const form = $(event.currentTarget!)[0];
  const formData = new FormData(form as HTMLFormElement);

  const formDataObject = Array.from(formData.entries()).reduce(
    (acc: { [key: string]: FormDataEntryValue }, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
  $.ajax({
    url: '/order/infos',
    type: 'post',
    data: formDataObject,
    success: (res) => {
      localStorage.setItem('toast', 'update');
      location.href = '/order/payment';
    },
    error: (xhr) => {
      toastError(xhr.status + xhr.statusText);
      hideLoading();
    },
  });
};
