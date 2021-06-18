$(() => {
    $(window).on("scroll", function(){
        let $header = $(".header").first();
        let $navbar = $header.find(".navbar").first();

        if(window.scrollY > $header.outerHeight(true) || (window.matchMedia( "(max-width: 990px)" ).matches))
        {
            $header.addClass("header-shrunk");
        }
        else
        {
            $header.removeClass("header-shrunk");
        }
    });
});
