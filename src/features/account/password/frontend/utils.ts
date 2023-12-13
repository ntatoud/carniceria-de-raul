const areNewPasswordsEqual = (): boolean => {
  const newPassword = $('input#newPassword').val();
  const newPasswordVerify = $('input#newPasswordCheck').val();

  if (newPassword !== newPasswordVerify) {
    $('#passwordMismatch').show();
    $('input#newPasswordCheck').addClass('error');
  } else {
    $('#passwordMismatch').hide();
    $('input#newPasswordCheck').removeClass('error');
  }

  return newPassword === newPasswordVerify;
};
