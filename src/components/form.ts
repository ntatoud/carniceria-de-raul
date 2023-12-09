// Global form functions
const canSubmitChangePassword = () => {};

$("input").on("keyup", () => {
  $("button[type='submit']").prop(
    "disabled",
    !(
      !$(".error").hasClass("show") &&
      !!$("input#oldPassword").val() &&
      !!$("input#newPassword").val() &&
      !!$("input#newPasswordCheck").val() &&
      areNewPasswordsEqual()
    )
  );
});

const canSignUp = () => {};
$("button[type='submit']").prop(
  "disabled",
  !(
    !$(".error").hasClass("show") &&
    $("input#name").val() &&
    $("input#surname").val() &&
    $("input#email").val() &&
    $("input#password").val()
  )
);
// Password related functions
const togglePassword = (event: MouseEvent) => {
  const toggleButton = $(event.currentTarget!);
  const passwordInput = toggleButton
    .parents(".input-group-prepend")
    .next("input");

  const type = passwordInput.attr("type") === "password" ? "text" : "password";
  passwordInput.attr("type", type);
  $(event.currentTarget!).toggleClass("bi-eye");
};

const checkPassword = (event: KeyboardEvent) => {
  const id = $(event.currentTarget!).attr("id");
  const password = $(event.currentTarget!).val();
  const url = window.location.pathname;
  $.post(
    `${window.location.pathname}/checkPassword`,
    { password },
    (data, status, xhr) => {
      if (status !== "success") {
        alert("error" + xhr.status + " " + xhr.statusText);
      } else {
        if (data !== "OK") {
          $(`.${id}.error`).addClass("show");
          $(`input#${id}`).addClass("error");
          $(`.${id}.error ul`).html(
            data.map((problem: string) => {
              return `<li> ${problem}</li>`;
            })
          );
          $("button[type='submit']").attr("disabled", "disabled");
        } else {
          $(`.${id}.error`).removeClass("show");
          $(`input#${id}`).removeClass("error");
        }
      }
    }
  );
};

// Email related functions
const checkEmail = (event: KeyboardEvent) => {
  const email = $(event.target!).val();
  $.post("/auth/signup/checkEmail", { email }, (data, status, xhr) => {
    if (status !== "success") {
      alert("error" + xhr.status + " " + xhr.statusText);
    } else {
      if (data === "NOK") {
        $(".email.error").addClass("show");
        $("input#email").addClass("error");
        $("button[type='submit']").attr("disabled", "disabled");
      }
    }
  });
};

const removeEmailError = () => {
  $(".email.error").removeClass("show");
  $("input#email").removeClass("error");
};
