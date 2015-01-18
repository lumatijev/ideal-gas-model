var pressure = $('#pressure'),
    volume = $('#volume'),
    numberOfMoles = $('#numberOfMoles'),
    constant = $('#constant'),
    temperature = $('#temperature'),
    container = d3.select('.model')
        .append('svg')
        .attr('width', '100%')
        .attr('height', $('svg').width())
        .attr('class', 'svg');

$(document).ready(function() {
    $('.ui.sidebar').sidebar('attach events', '.launch.button');
    $("sup").popup();

    calculate();
    calculationChanged();
});

$('.launch.button').hover(function() {
    $(this).width('100px');
    $(".launch.button > .text").show();
}, function() {
    $(".launch.button > .text").hide();
    $(this).width("10px");
});

var formula = function(p, v, r, t) {
    return (p.val() * v.val()) / (r.val() * (parseFloat(t.val()) + parseFloat(273.15)).toFixed(2));
};

var calculate = function() {
    numberOfMoles.val(formula(pressure, volume, constant, temperature));
};

$('#pressure, #volume, #temperature').change(function() {
    calculate();
    d3.selectAll('.svg > *').remove();
    calculationChanged();
});

var calculationChanged = function() {
    var nodes = d3.range(Math.round(numberOfMoles.val())).map(function(d, i) {
        var radius = 5,
            x = Math.random() * $('.svg').width() + radius,
            y = Math.random() * $('.svg').height() + radius;
        return {
            radius: radius,
            mass: radius,
            x: x,
            y: y,
            px: x + Math.random() * 2,
            py: y + Math.random() * 2
        };
    });

    var circles = container.selectAll('.circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('r', function(d) {
            return d.radius;
        });

    var redraw = function() {
        circles.attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            });
        force.resume();
    };

    var force = d3.layout.force()
        .friction(1)
        .nodes(nodes)
        .charge(0)
        .gravity(0)
        .on('tick.redraw', redraw)
        .start();

    d3.z.collide(force);
    d3.z.deflect(force, 0, 0, $('.svg').width(), $('.svg').height());
};
