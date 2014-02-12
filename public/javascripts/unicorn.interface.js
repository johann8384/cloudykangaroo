/**
 * Unicorn Admin Template
 * Version 2.1.0
 * Diablo9983 -> diablo9983@gmail.com
**/

$(document).ready(function(){
	

	$(".sparkline_line_bad span").sparkline("html", {
		type: "line",
		fillColor: "#FFC4C7",
		lineColor: "#BA1E20",
		width: "50",
		height: "24"
	});	
	$(".sparkline_line_neutral span").sparkline("html", {
		type: "line",
		fillColor: "#CCCCCC",
		lineColor: "#757575",
		width: "50",
		height: "24"
	});
	
	$(".sparkline_bar_good span").sparkline('html',{
		type: "bar",
		barColor: "#459D1C",
		barWidth: "5",
		height: "24"
	});
	$(".sparkline_bar_bad span").sparkline('html',{
		type: "bar",
		barColor: "#BA1E20",
		barWidth: "5",
		height: "24"
	});	
	$(".sparkline_bar_neutral span").sparkline('html',{
		type: "bar",
		barColor: "#757575",
		barWidth: "5",
		height: "24"
	});

    // === Popovers === //
    var placement = 'bottom';
    var trigger = 'hover';
    var html = true;

    $('.popover-visits').popover({
       placement: placement,
       content: '<span class="content-big">36094</span> <span class="content-small">Total Visits</span><br /><span class="content-big">220</span> <span class="content-small">Visits Today</span><br /><span class="content-big">200</span> <span class="content-small">Visits Yesterday</span><br /><span class="content-big">5677</span> <span class="content-small">Visits in This Month</span>',
       trigger: trigger,
       html: html   
    });
    $('.popover-users').popover({
       placement: placement,
       content: '<span class="content-big">1433</span> <span class="content-small">Total Users</span><br /><span class="content-big">0</span> <span class="content-small">Registered Today</span><br /><span class="content-big">0</span> <span class="content-small">Registered Yesterday</span><br /><span class="content-big">16</span> <span class="content-small">Registered Last Week</span>',
       trigger: trigger,
       html: html   
    });
    $('.popover-orders').popover({
       placement: placement,
       content: '<span class="content-big">8650</span> <span class="content-small">Total Orders</span><br /><span class="content-big">29</span> <span class="content-small">Pending Orders</span><br /><span class="content-big">32</span> <span class="content-small">Orders Today</span><br /><span class="content-big">64</span> <span class="content-small">Orders Yesterday</span>',
       trigger: trigger,
       html: html   
    });
    $('.popover-tickets').popover({
       placement: placement,
       content: '<span class="content-big">2968</span> <span class="content-small">All Tickets</span><br /><span class="content-big">48</span> <span class="content-small">New Tickets</span><br /><span class="content-big">495</span> <span class="content-small">Solved</span>',
       trigger: trigger,
       html: html   
    });

});
