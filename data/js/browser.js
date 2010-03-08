(function(){
	$.Browser = {
		defaults: {
			title: 'Choose Directory',
			url:   '/browser/'
		}
	};

	var fileBrowserDialog  = null;
	var currentBrowserPath = null;

	function browse(path, endpoint) {
		currentBrowserPath = path;
		$.getJSON(endpoint, { path: path }, function(data){
			fileBrowserDialog.empty();
			$('<h1>').text(path).appendTo(fileBrowserDialog);
			list = $('<ul>').appendTo(fileBrowserDialog);
			$.each(data, function(i, entry) {
				link = $("<a />").click(function(){ browse(entry.path, endpoint); }).text(entry.name);
				$('<span class="ui-icon ui-icon-folder-collapsed"></span>').appendTo(link);
				link.hover(
					function(){jQuery("span", this).addClass("ui-icon-folder-open");    },
					function(){jQuery("span", this).removeClass("ui-icon-folder-open"); }
				);
				link.appendTo(list);
			});
			$("a", list).wrap('<li class="ui-state-default ui-corner-all">');
		});
	}

	$.fn.fileBrowser = function(options){
		options = $.extend({}, $.Browser.defaults, options);
		options.field = $(this);
		return options.field.addClass('fileBrowserField').after($('<input type="button" value="Browse&hellip;" class="fileBrowser" />').click(function(){
			if(!fileBrowserDialog) {
				fileBrowserDialog = $('<div id="fileBrowserDialog" style="display:hidden"></div>').appendTo('body').dialog({
					title:     options.title,
					position:  ['center', 50],
					width:     600,
					height:    600,
					modal:     true,
					autoOpen:  false
				});
			}
			fileBrowserDialog.dialog('option', 'buttons',
			{
				"Ok": function(){
					options.field.val(currentBrowserPath);
					if(options.key)
						$.cookie('fileBrowser-' + options.key, currentBrowserPath);
					fileBrowserDialog.dialog("close");
				},
				"Cancel": function(){
					fileBrowserDialog.dialog("close");
				}
			});
			
			initialDir = options.field.val() || (options.key && $.cookie('fileBrowser-' + options.key)) || '/';
			browse(initialDir, options.url)
			fileBrowserDialog.dialog('open');
			return false;
		}));
	};
})();