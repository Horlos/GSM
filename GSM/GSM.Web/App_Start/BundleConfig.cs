using System.Web.Optimization;
using GSM.Infrastructure;

namespace GSM
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            RegisterStyleBundles(bundles);
            RegisterScriptBundles(bundles);
        }

        private static void RegisterStyleBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css")
                .Include("~/Content/bootstrap.css", new CssRewriteUrlTransformWrapper())
                .Include("~/Content/smoothLoad.css", new CssRewriteUrlTransformWrapper())
                .Include("~/Content/site.css", new CssRewriteUrlTransformWrapper()));

            bundles.Add(new StyleBundle("~/angular/css")
                .Include("~/Content/ui-grid.css", new CssRewriteUrlTransformWrapper()));

            bundles.Add(new StyleBundle("~/angular-colorpicker/css")
                .Include("~/Content/colorpicker.css", new CssRewriteUrlTransformWrapper())
                .Include("~/Content/colorpicker.min.css", new CssRewriteUrlTransformWrapper()));
        }

        private static void RegisterScriptBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery/jquery-{version}.js",
                "~/Scripts/polyfill.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                "~/Scripts/angular/angular.js",
                "~/Scripts/angular-resource/angular-resource.js",
                "~/Scripts/angular-filter.min.js",
                "~/Scripts/angular-sanitize/angular-sanitize.js",
                "~/Scripts/angular-route/angular-route.min.js",
                "~/Scripts/ui-grid.js",
                "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                "~/Scripts/angular-file-saver/angular-file-saver.bundle.js",
                "~/Scripts/autoFitColumns.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularMoment").Include(
                "~/Scripts/angular-moment/moment/moment.min.js",
                "~/Scripts/angular-moment/angular-moment.min.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/angular-colorpicker").Include(
                "~/Scripts/angular-colorpicker/bootstrap-colorpicker-module.js",
                "~/Scripts/angular-colorpicker/bootstrap-colorpicker-module.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/contextmenu").Include(
                "~/Scripts/contextMenu.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery-validate/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap.js",
                "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/ui-bootstrap").Include(
                "~/Scripts/ui-bootstrap-tpls.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular-app").Include(
               "~/Scripts/angular-app/framework/appSections.js",
               "~/Scripts/angular-app/framework/appBase.js",
               "~/Scripts/angular-app/app.js"));

            bundles.Add(new ScriptBundle("~/bundles/logger").Include(
               "~/Scripts/angular-app/common/logger/loggerSection.js",
               "~/Scripts/angular-app/common/logger/loggerService.js"));

            bundles.Add(new ScriptBundle("~/bundles/dashboard").Include(
                "~/Scripts/angular-app/dashboard/dashboardSection.js",
                "~/Scripts/angular-app/dashboard/dashboardService.js",
                "~/Scripts/angular-app/dashboard/dashboardCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/create-duplex-batch").Include(
                "~/Scripts/angular-app/duplexes/duplexesSection.js",
                "~/Scripts/angular-app/duplexes/duplexesService.js",
                "~/Scripts/angular-app/duplexes/createDuplexBatchCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/edit-duplex-batch").Include(
                "~/Scripts/angular-app/duplexes/duplexesSection.js",
                "~/Scripts/angular-app/duplexes/duplexesService.js",
                "~/Scripts/angular-app/duplexes/editDuplexBatchCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/import-duplexes").Include(
                "~/Scripts/angular-app/duplexes/duplexesSection.js",
                "~/Scripts/angular-app/duplexes/routeConfig.js",
                "~/Scripts/angular-app/duplexes/duplexesService.js",
                "~/Scripts/angular-app/duplexes/editImportedDuplexCtrl.js",
                "~/Scripts/angular-app/duplexes/importDuplexesCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/duplex-batches").Include(
                "~/Scripts/angular-app/duplexes/duplexesSection.js",
                "~/Scripts/angular-app/duplexes/duplexesService.js",
                "~/Scripts/angular-app/duplexes/duplexBatchesCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/create-instrument").Include(
                "~/Scripts/angular-app/instruments/instrumentsSection.js",
                "~/Scripts/angular-app/instruments/instrumentsService.js",
                "~/Scripts/angular-app/instruments/createInstrumentCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/edit-instrument").Include(
                "~/Scripts/angular-app/instruments/instrumentsSection.js",
                "~/Scripts/angular-app/instruments/instrumentsService.js",
                "~/Scripts/angular-app/instruments/editInstrumentCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/instruments").Include(
                "~/Scripts/angular-app/instruments/instrumentsSection.js",
                "~/Scripts/angular-app/instruments/instrumentsService.js",
                "~/Scripts/angular-app/instruments/instrumentsCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/lookup").Include(
                "~/Scripts/angular-app/lookup/lookupSection.js",
                "~/Scripts/angular-app/lookup/routeConfig.js",
                "~/Scripts/angular-app/lookup/lookupService.js",
                "~/Scripts/angular-app/lookup/lookupCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/create-modifierTemplate").Include(
                "~/Scripts/angular-app/modifierTemplates/modifierTemplatesSection.js",
                "~/Scripts/angular-app/modifierTemplates/modifierTemplatesService.js",
                "~/Scripts/angular-app/modifierTemplates/createModifierTemplateCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/edit-modifierTemplate").Include(
                "~/Scripts/angular-app/modifierTemplates/modifierTemplatesSection.js",
                "~/Scripts/angular-app/modifierTemplates/modifierTemplatesService.js",
                "~/Scripts/angular-app/modifierTemplates/editModifierTemplateCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/modifierTemplates").Include(
                "~/Scripts/angular-app/modifierTemplates/modifierTemplatesSection.js",
                "~/Scripts/angular-app/modifierTemplates/modifierTemplatesService.js",
                "~/Scripts/angular-app/modifierTemplates/modifierTemplatesCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/create-modStructure").Include(
                "~/Scripts/angular-app/modStructures/modStructuresSection.js",
                "~/Scripts/angular-app/modStructures/modStructuresService.js",
                "~/Scripts/angular-app/modStructures/createModStructureCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/edit-modStructure").Include(
                "~/Scripts/angular-app/modStructures/modStructuresSection.js",
                "~/Scripts/angular-app/modStructures/modStructuresService.js",
                "~/Scripts/angular-app/modStructures/editModStructureCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/modStructures").Include(
                "~/Scripts/angular-app/modStructures/modStructuresSection.js",
                "~/Scripts/angular-app/modStructures/modStructuresService.js",
                "~/Scripts/angular-app/modStructures/modStructuresCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/manage").Include(
                "~/Scripts/angular-app/manage/manageSection.js",
                "~/Scripts/angular-app/manage/authorizationService.js",
                "~/Scripts/angular-app/manage/manageRolesCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/create-species").Include(
                "~/Scripts/angular-app/species/speciesSection.js",
                "~/Scripts/angular-app/species/speciesService.js",
                "~/Scripts/angular-app/species/createSpeciesCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/edit-species").Include(
                "~/Scripts/angular-app/species/speciesSection.js",
                "~/Scripts/angular-app/species/speciesService.js",
                "~/Scripts/angular-app/species/editSpeciesCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/species").Include(
                "~/Scripts/angular-app/species/speciesSection.js",
                "~/Scripts/angular-app/species/speciesService.js",
                "~/Scripts/angular-app/species/speciesCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/create-strand-batch").Include(
                "~/Scripts/angular-app/strands/strandsSection.js",
                "~/Scripts/angular-app/strands/routeConfig.js",
                "~/Scripts/angular-app/strands/strandsService.js",
                "~/Scripts/angular-app/strands/createStrandBatchDirective.js",
                "~/Scripts/angular-app/strands/splitStrandBatchCtrl.js",
                "~/Scripts/angular-app/strands/createStrandBatchCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/edit-strand-batch").Include(
                "~/Scripts/angular-app/strands/strandsSection.js",
                "~/Scripts/angular-app/strands/strandsService.js",
                "~/Scripts/angular-app/strands/editStrandBatchCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/import-strands").Include(
                "~/Scripts/angular-app/strands/strandsSection.js",
                "~/Scripts/angular-app/strands/routeConfig.js",
                "~/Scripts/angular-app/strands/strandsService.js",
                "~/Scripts/angular-app/strands/editImportedStrandCtrl.js",
                "~/Scripts/angular-app/strands/importStrandsCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/export-sequence").Include(
                "~/Scripts/angular-app/synthesisRequest/synthesisRequestSection.js",
                "~/Scripts/angular-app/synthesisRequest/synthesisRequestsService.js",
                "~/Scripts/angular-app/synthesisRequest/exportSequenceCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/create-target").Include(
                "~/Scripts/angular-app/targets/targetsSection.js",
                "~/Scripts/angular-app/targets/targetsService.js",
                "~/Scripts/angular-app/targets/createTargetCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/edit-target").Include(
                "~/Scripts/angular-app/targets/targetsSection.js",
                "~/Scripts/angular-app/targets/targetsService.js",
                "~/Scripts/angular-app/targets/editTargetCtrl.js"));

            bundles.Add(new ScriptBundle("~/bundles/targets").Include(
                "~/Scripts/angular-app/targets/targetsSection.js",
                "~/Scripts/angular-app/targets/targetsService.js",
                "~/Scripts/angular-app/targets/targetsCtrl.js"));
        }
    }
}
