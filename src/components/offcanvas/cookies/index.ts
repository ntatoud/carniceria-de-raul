// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cookieBannerShow = () => {
  $('main').append(
    '<div class="offcanvas offcanvas-bottom show h-auto"\
        tabindex="-1"\
        id="offcanvasBottom"\
        data-bs-scroll="true"\
        data-bs-backdrop="false"\
        tabindex="-1"\
        aria-labelledby="offcanvasBottomLabel"\
    >\
    <div class="offcanvas-body d-flex align-items-center justify-content-between">\
        <img\
            src="/assets/images/cookie.png"\
            alt="Cookie"\
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
                aria-label="Close"\
                onclick="setCookies(false)"\
            >Decline</button>\
            <button\
                type="button"\
                class="button button-primary button-lg"\
                data-bs-dismiss="offcanvas"\
                aria-label="Close"\
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
