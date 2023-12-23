// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cookieBannerShow = () => {
  $('main').append(
    '<div class="offcanvas offcanvas-bottom show h-auto"\
        tabindex="-1"\
        id="offcanvasBottom"\
        data-bs-scroll="true"\
        data-bs-backdrop="false"\
        tabindex="-1"\
        aria-label="Banner to inform about the website cookie policy"\
    >\
    <div class="offcanvas-body d-flex align-items-center justify-content-between">\
        <img\
            src="/assets/images/cookie.png"\
            role="img"\
            alt="Illustration of a cookie"\
            aria-label="Illustration of a cookie"\
            srcset="/assets/images/cookie.svg"\
        >\
        <p>\
            This website uses cookies to enhance your browsing experience and provide essential functionality, specifically for managing your shopping cart. <b>By continuing to use this website, you consent to the use of <a href="/about">these cookies</a>.</b>\
        </p>\
        <div class="buttons d-flex">\
            <button\
                type="button"\
                class="button button-link button-lg"\
                data-bs-dismiss="offcanvas"\
                aria-label="Decline"\
                onclick="setCookies(false)"\
            >Decline</button>\
            <button\
                type="button"\
                class="button button-primary button-lg"\
                data-bs-dismiss="offcanvas"\
                aria-label="Allow"\
                onclick="setCookies(true)"\
            >Allow</button>\
        </div>\
    </div>\
</div>'
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cookieBannerHide = () => {
  $('main .offcanvas').remove();
};
