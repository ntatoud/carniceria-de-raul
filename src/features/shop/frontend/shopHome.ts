// Home javascript
const scrollToRight = () => {
  scrollPos += desktopScroll;
  $(`.shop-products-container:not(.hide)`).scrollLeft(scrollPos);
};
const scrollToLeft = () => {
  scrollPos -= desktopScroll;
  $(`.shop-products-container:not(.hide)`).scrollLeft(scrollPos);
};

const setScroll = () => {
  scrollPos = $(`.shop-products-container:not(.hide)`).scrollLeft() ?? 0;
};

const switchTab = (event: MouseEvent) => {
  const tab = event.target!;
  const tabId = $(tab).attr("id");
  const otherTab = $(`button#${tabId === "ofertas" ? "mejores" : "ofertas"}`);
  const otherTabId = $(otherTab).attr("id");

  // Display the products related to the tab that has been clicked and activate the tab
  $(tab).addClass("active");
  $(`.shop-products-container.${tabId}`).show();
  $(`.shop-products-container.${tabId}`).removeClass("hide");

  // Remove the products related to the other tab and desactivate the tab
  $(otherTab).removeClass("active");
  $(`.shop-products-container.${otherTabId}`).addClass("hide");
  $(`.shop-products-container.${otherTabId}`).hide();

  // Reset the scroll for the new tab
  scrollPos = 0;
};

const desktopScroll = 400;
$(`.shop-products-container.mejores`).hide();
let scrollPos = 0;
