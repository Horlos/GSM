namespace App.ModifierTemplates {
    var section = new Framework.AppSection('app.modifierTemplates',
        [
            'ui.bootstrap.contextMenu',
            'ui.bootstrap',
            'ui.grid.autoFitColumns',
            'common',
            'common.logger',
            'app.services',
            'app.widgets'
        ]);
    App.getAppContainer().addSection(section);
}