namespace App.ModStructures {
    var section = new Framework.AppSection("app.modStructures",
    [
        'ui.bootstrap',
        'ui.bootstrap.tooltip',
        'ui.grid.autoFitColumns',
        'colorpicker.module',
        'ngFileUpload',
        'common',
        'common.logger',
        'app.services',
        'app.widgets'
    ]);
    App.getAppContainer().addSection(section);
}