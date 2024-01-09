/* eslint-disable @typescript-eslint/no-unused-vars */
// Cookies handling part
const setCookies = (mode: boolean) => {
  $.ajax({
    url: '/cookies',
    type: 'post',
    data: { areAllowed: mode },
    success: (res) => {
      cookieBannerHide();
      console.log(res.areCookiesAllowed);
      if (res.areCookiesAllowed) {
        $('.product-form button[type="submit"]').removeClass(
          'cookies-redirect'
        );
      }
    },
    error: () => {},
  });
};

$.ajax({
  url: '/cookies',
  type: 'get',
  success: (res) => {
    if (!res.areCookiesAllowed && res.areCookiesAllowed === undefined) {
      cookieBannerShow();
    }
    if (res.areCookiesAllowed === 'false') {
      $('.product-form button[type="submit"]').addClass('cookies-redirect');
    }
  },
});

// Language handling part
const changeLanguage = (langKey: string) => {
  $.ajax({
    url: '/lang',
    type: 'POST',
    data: { langKey: langKey },
    success: (res) => {
      document.documentElement.lang = langKey;
      localStorage.setItem('lang', JSON.stringify(langKey));
      location.reload();
    },
  });
};
const languageItem = localStorage.getItem('lang');

const langKey = languageItem ? JSON.parse(languageItem) : 'es';

if (!languageItem) {
  localStorage.setItem('lang', JSON.stringify(langKey));
}

const LANGUAGE_TABLE = [
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
];

const langDisplay =
  LANGUAGE_TABLE.find((el) => el.id === langKey) ?? LANGUAGE_TABLE[0];

$('.dropdown.lang .dropdown-toggle').html(
  `${langDisplay?.flag} ${langDisplay?.name}`
);

// FORM
$('form').on('submit', (event) => {
  const target = $(event.target!).find(` button[type="submit"]`);

  if (!target.has('.spinner-border').length) {
    target.prepend(
      "\
      <div class='spinner-border spinner-border-sm text-light' role='status'>\
      <span class='sr-only'></span>\
      </div>"
    );
  }
});

const hideLoading = () => {
  $(` button[type="submit"] .spinner-border`).remove();
};

$('.preloader').remove();
if ($('.toast').length) {
  setTimeout(() => {
    $(`.toast-container  .toast`).addClass('fade-out').removeClass('fade-in');
  }, 2800);
  setTimeout(() => {
    $(`.toast-container .toast`).remove();
  }, 3000);
}
