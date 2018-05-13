import IResource = angular.resource.IResource;
import IResourceService = angular.resource.IResourceService;
import IResourceClass = angular.resource.IResourceClass;
import {MaterialRequestModel} from "./material-request.model";

export class MaterialRequestResource {
    resource:IResourceClass<IResource<MaterialRequestModel>>;
    
    static $inject:string[] = [
        '$resource'
    ];

    constructor(private $resource:IResourceService) {
        this.resource = $resource('api/materialrequest');
    }
}
