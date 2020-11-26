class ListController {
    constructor(view,service){
        this.view = view;
        this.service = service;
        this.key;
        this.initList();
    }

    initList = async () => {
        await this.getDataAndPrint()
        this.bindInputs()
    }
    getDataAndPrint = async () => {
        this.key = await this.service.getCurrentUser().then(data=> JSON.parse(data).sub);
        let html = await this.service.getLocalWorks(this.key);
        this.view.printJobs(html);
    }
    bindInputs = () => {
        this.view.bindAcceptWorkButton(this.handlerDisplayWork);
        this.view.bindAccept(this.handlerAcceptWork);
        this.view.bindCloseDetails();
    }
    handlerDisplayWork = (id) => {
        return this.service.getSelectedWorkData(id);
    }
    handlerAcceptWork = () => {
        this.service.setWorkerToWork();
        this.getDataAndPrint();
    }
}