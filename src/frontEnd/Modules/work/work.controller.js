class WorkController {
    constructor(view,service){
        this.view = view;
        this.service = service;
        this.displayData();
        this.view.bindCreateButton(this.handlerCreateWork);
    }
    displayData = async () => {
        this.view.printUserData(await this.service.getUserData());
        this.service.mapService.setUserLocation(this.service.user.locationPoint);
    }

    handlerCreateWork = (data) => {
        this.service.uploadWork(data);
    }
}