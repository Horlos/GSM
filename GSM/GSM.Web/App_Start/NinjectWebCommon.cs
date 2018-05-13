using GSM.Data.Models;
using GSM.Data.Services;
using GSM.Data.Services.Interfaces;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(GSM.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(GSM.App_Start.NinjectWebCommon), "Stop")]

namespace GSM.App_Start
{
    using System;
    using System.Web;

    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;

    public static class NinjectWebCommon 
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start() 
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }
        
        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }
        
        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<GeneSythesisDBContext>().To<GeneSythesisDBContext>();
            kernel.Bind<IInstrumentsService>().To<InstrumentsService>();
            kernel.Bind<ITargetsService>().To<TargetsService>();
            kernel.Bind<ISpeciesService>().To<SpeciesService>();
            kernel.Bind<IModStructuresService>().To<ModStructuresService>();
            kernel.Bind<IAuthorizationService>().To<AuthorizationService>();
            kernel.Bind<IModifierTemplatesService>().To<ModifierTemplatesService>();
            kernel.Bind<IMaterialRequestsService>().To<MaterialRequestsService>();
            kernel.Bind<ISynthesisRequestsService>().To<SynthesisRequestsService>();
        }        
    }
}
