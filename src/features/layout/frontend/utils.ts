const activeNav = () => {
    $('menu a')
        .filter(
            (_, navItem) => $(navItem).attr('href') === window.location.pathname
        )
        .addClass('active');
};

activeNav();
