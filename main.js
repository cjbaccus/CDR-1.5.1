
/*---------------------------------------------------------------------------

    Filename: main.js
    Project:  CDR Log Import Extension
    (C) Copyright 2015, SAIC

    Summary:        Main start file for CDR Log Import extension
    REVISION: Version 1.5.0
	 Nothing changed on this file.
	 
    Developer(s):   Carl Baccus

---------------------------------------------------------------------------*/
var g_form;

include "tools_menu_inserter.js";
include "CDR_log_import_form.js";


if (Extension.isContextPackage())
{
    // if the script is packaged as an extension, when the
    // script is run, add a menu item to the host application 
    // and connect the menu item click event to a handler
    var item = insertToolsMenuItem("Import CDR Logs...");
    item.click.connect(onCDRLogImportMenuItemClicked);
}
 else
{
    // if the script is not packaged as an extension, when
    // the script is run, simply show the form
    var g_form = new CDRLogImportForm;
    g_form.center();
    g_form.show();
}

function onCDRLogImportMenuItemClicked()
{
    // if the menu item is clicked, show the form
    var g_form = new CDRLogImportForm;
    g_form.center();
    g_form.show();
}

// start the application event loop to process
// application events
Application.run();

