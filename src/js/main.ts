// eslint-disable-next-line @typescript-eslint/no-unused-vars
const changeLanguage = (langKey: string) => {
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

const language = JSON.parse(localStorage.getItem('lang') ?? '{}');
if (language) {
  document.documentElement.lang = language?.key;
  document.documentElement.dir = language?.dir ?? 'ltr';
  document.documentElement.style.fontSize = `${
    (language?.fontScale ?? 1) * 100
  }%`;
} else {
  document.documentElement.lang = 'es';
  document.documentElement.dir = 'ltr';
  document.documentElement.style.fontSize = '100%';
}

const LANGUAGE_TABLE = [
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'ar', name: 'مغربي', flag: '🇲🇦' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
];

const lang = LANGUAGE_TABLE.find((el) => el.id === language.key) ?? {
  flag: '🇪🇸',
  name: 'Español',
};

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

$('.dropdown.lang .dropdown-toggle').html(`${lang?.flag} ${lang?.name}`);

$('.preloader').remove();
