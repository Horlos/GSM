namespace App.Widgets {
    var section = new Framework.AppSection('app.widgets',
        [
        'ngSanitize',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.moveColumns',
        'ui.grid.pagination',
        'ui.grid.resizeColumns',
        'ui.grid.selection'
    ]);
    App.getAppContainer().addSection(section);
    section.getInstance()
        .controller("SelectModalCtrl", SelectModalCtrl);
}
