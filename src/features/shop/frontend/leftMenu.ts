const toggleLeftMenu = (event: MouseEvent) => {
  $(event.currentTarget!).parents('.left-menu').toggleClass('collapse');
};

const loadSwitch = (name: string, params: string[]) => {
  $(`.form-switch input[name='${name}']`).prop(
    'checked',
    params.includes(`${name}=on`)
  );
};

const turnOtherSwitchOff = (event: MouseEvent) => {
  if ($(event.currentTarget!).prop('checked')) {
    const switchName = $(event.currentTarget!).attr('name');

    const otherSwitch = $(
      `.form-switch input[name='${switchName === 'price' ? 'name' : 'price'}']`
    );
    otherSwitch.prop('checked', false);
  }
};

const params = window.location.search.replace('?', '').split('&');
loadSwitch('ofertas', params);
loadSwitch('price', params);
loadSwitch('name', params);

// Desactivate previous item
$('.left-menu-categories .left-menu-items.active').removeClass('active');

// Activate new one
$(
  `.left-menu-categories .left-menu-item[href='${window.location.pathname}']`
).addClass('active');
