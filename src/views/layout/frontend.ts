const activeNav = () => {
  $('menu a')
    .filter(
      (_, navItem) => $(navItem).attr('href') === window.location.pathname
    )
    .addClass('active');
};

activeNav();

$('.mobile .dropdown-toggle').prepend(
  $(`.mobile .dropdown-menu  a[href="${location.pathname}"]`!)
);
