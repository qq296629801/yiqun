var size = 55; // 25 is the sweet spot for me, how high can you get?
var rot = 0;
var interval = 1000;
var explosions = 0;
var maxExplosions = 100; // the total number of fireworks you'll get. Kindof like at the end of a level in Super Mario where you get 1, 3, or 6 fireworks. 

$(".spawn").on("click", function(e) {
    particle(e.pageX, e.pageY);
});

function particle(x, y) {
    var i = 0;
    var docFrag = document.createDocumentFragment("div");
    while (i < size) {
        var particle = document.createElement("div");
        var particleParent = document.createElement("div");

        $(particle).addClass("particle").append(particle).css({
            animationDuration: 2 + Math.random() * 6 + "s",
            animationDelay: Math.random() * 0.1 + "s"
        }).one("webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend", function(e) {
            $(e.currentTarget).parent().remove();
        });
        $(particleParent).addClass("particleParent").append(particle).css({
            transform: "rotateX(" + Math.random() * 360 + "deg) rotateY(" + Math.random() * 360 + "deg) rotateZ(" + Math.random() * 360 + "deg) ",
            left: x,
            top: y

        });
        $(docFrag).append(particleParent);
        i++;
    }
    $(".particles").append(docFrag);
}

function newParticle() {
    explosions++;
    interval = 150 + Math.random() * 1000;
    if (explosions < maxExplosions) {
        particle(Math.random() * $(window).width(), Math.random() * $(window).height());
        window.setTimeout(newParticle, interval);
    }
}
newParticle();


/*function rotateContainer () {
  rot = (rot + 1)%360;
        $(".particles").css({
        transform: "rotateX("+(-rot)+"deg) "});
    requestAnimationFrame(rotateContainer);
}
requestAnimationFrame(rotateContainer);*/