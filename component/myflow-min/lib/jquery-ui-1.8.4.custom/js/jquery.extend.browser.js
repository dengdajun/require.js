define( [ "jquery", "jquery-1.4.2" ], function( newJQuery, oldJQuery ) {
	console.log(jQuery().jquery);
	console.log(newJQuery().jquery);
	oldJQuery = jQuery;
	console.log(oldJQuery.curCss);
	newJQuery.browser = oldJQuery.browser;
	newJQuery.oldJQuery = oldJQuery;
	
	newJQuery.curCSS = function( ele, attr, value ) {
		var args = Array.prototype.slice.call(arguments);
		console.log( oldJQuery().jquery )
		oldJQuery.curCSS.apply( oldJQuery, args );
	}
	
	oldJQuery.noConflict(true);
	
	return newJQuery;
} );