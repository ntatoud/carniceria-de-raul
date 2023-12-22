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
  $(event.target!).find(` button[type="submit"]`).prepend(
    "\
    <div class='spinner-border spinner-border-sm text-light' role='status'>\
      <span class='sr-only'></span>\
    </div>"
  );
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hideLoading = () => {
  $(` button[type="submit"] .spinner-border`).remove();
};

$('.preloader').remove();

document.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    $('header').attr(
      'style',
      'position:fixed; top:0; width: 100%; z-index: 100'
    );
  } else {
    $('header').removeAttr('style');
  }
});
