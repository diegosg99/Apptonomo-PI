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
        this.view.printTables(data);
        this.view.bindChangePhoto(this.handlerChangePhoto);
        this.view.bindAcceptedRows(this.handlerDisplayWork);
        this.view.bindWaitingRows(this.handlerDisplayWork);
    }

    bindInputs = () => {
        //this.view.bindAcceptWorkButton(this.handlerDisplayWork);
        this.view.bindCloseDetails();
        this.view.bindEnd(this.handlerEnd);
        this.view.bindCancel(this.handlerCancel);
        //this.view.bindRate(this.handlerRate);
    }

    handlerChangePhoto = (file) => {
        this.service.changePhoto(file)
    }

    handlerDisplayWork = async (id) => {
        let work = await this.service.getSelectedWorkData(id);
        this.view.displayRelatedWork(work);
        this.bindInputs();
    }
    handlerDisplayAcceptedWork = (id) => {
        this.service.getWork(id);
    }
    handlerEnd = () => {
        this.service.endWork();
    }
    handlerCancel = () => {
        this.service.cancelWork();
    }
    /* handlerRate = (id) => {
        let data = {};
        this.service.rateUser(data);
    } */
}