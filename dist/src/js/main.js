"use strict";
var _a, _b, _c, _d;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const changeLanguage = (langKey) => {
    $.ajax({
        url: '/lang',
        type: 'POST',
        data: { langKey: langKey },
        success: (res) => {
            var _a, _b;
            document.documentElement.lang = langKey;
            document.documentElement.dir = (_a = res === null || res === void 0 ? void 0 : res.dir) !== null && _a !== void 0 ? _a : 'ltr';
            document.documentElement.style.fontSize = `${((_b = res === null || res === void 0 ? void 0 : res.fontScale) !== null && _b !== void 0 ? _b : 1) * 100}%`;
            localStorage.setItem('lang', JSON.stringify(res));
            location.reload();
        },
    });
};
const language = JSON.parse((_a = localStorage.getItem('lang')) !== null && _a !== void 0 ? _a : '{}');
if (language) {
    document.documentElement.lang = language === null || language === void 0 ? void 0 : language.key;
    document.documentElement.dir = (_b = language === null || language === void 0 ? void 0 : language.dir) !== null && _b !== void 0 ? _b : 'ltr';
    document.documentElement.style.fontSize = `${((_c = language === null || language === void 0 ? void 0 : language.fontScale) !== null && _c !== void 0 ? _c : 1) * 100}%`;
}
else {
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
const lang = (_d = LANGUAGE_TABLE.find((el) => el.id === language.key)) !== null && _d !== void 0 ? _d : {
    flag: '🇪🇸',
    name: 'Español',
};
$('.dropdown.lang .dropdown-toggle').html(`${lang === null || lang === void 0 ? void 0 : lang.flag} ${lang === null || lang === void 0 ? void 0 : lang.name}`);
