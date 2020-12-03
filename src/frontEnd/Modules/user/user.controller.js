class userController{
    constructor(view,service){
        this.view = view;
        this.service = service;
        this.key;
        //this.user;

        this.service.lockService.checkToken();
        this.init();
    }

    init = async () => {
        this.key = (await this.service.getCurrentUser()).sub;
        let data = await this.service.bringRelatedData(this.key);
        console.log(data);
        this.view.printTables(data);
        this.view.bindChangePhoto(this.handlerChangePhoto);
    }

    bindInputs = () => {
        this.view.bindAcceptWorkButton(this.handlerDisplayWork);
        this.view.bindAccept(this.handlerAcceptWork);
        this.view.bindCloseDetails();
    }

    handlerChangePhoto = (file) => {
        this.service.changePhoto(file)
    }

    handlerDisplayWork = (id) => {
        return this.service.getSelectedWorkData(id);
    }
    handlerAcceptWork = () => {
        this.service.setWorkerToWork();
        this.getDataAndPrint();
    }

}