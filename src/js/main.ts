// eslint-disable-next-line @typescript-eslint/no-unused-vars
const changeLanguage = (langKey: string, preventReload?: boolean) => {
  $.ajax({
    url: '/lang',
    type: 'POST',
    data: { langKey: langKey },
    success: (res) => {
      document.documentElement.lang = langKey;
      document.documentElement.dir = res?.dir ?? 'ltr';
      document.documentElement.style.fontSize = `${
        (res?.fontScale ?? 1) * 100
      }%`;
      localStorage.setItem('lang', JSON.stringify(res));
      location.reload();
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setCookies = (mode: boolean) => {
  $.ajax({
    url: '/cookies',
    type: 'post',
    data: { areAllowed: mode },
    success: (res) => {
      cookieBannerHide();
      console.log(res);
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
    console.log(res);
    if (!res.areCookiesAllowed && res.areCookiesAllowed === undefined) {
      cookieBannerShow();
      $('.product-form button[type="submit"]').addClass('cookies-redirect');
    }
  },
});
const languageItem = localStorage.getItem('lang');

const language = languageItem ? JSON.parse(languageItem) : { key: 'es' };
if (!languageItem) {
  localStorage.setItem('lang', JSON.stringify(language));
}

const LANGUAGE_TABLE = [
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'ar', name: 'مغربي', flag: '🇲🇦' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
];

const langDisplay =
  LANGUAGE_TABLE.find((el) => el.id === language?.key) ?? LANGUAGE_TABLE[0];

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
