namespace App.Common {
    import apf = App.Framework;
    App.getAppContainer().addSection(new apf.AppSection('common', ['common.logger','toastr']));
}