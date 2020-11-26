class ListController {
    constructor(view,service){
        this.view = view;
        this.service = service;
        this.key;
        this.initList();
    }

    initList = async () => {
        this.key = await this.service.getCurrentUser().then(data=> JSON.parse(data).sub);
        let html = await this.service.getLocalWorks(this.key);
        this.view.printJobs(html);
        setTimeout(1000);
        this.view.bindAcceptWorkButton(this.handlerDisplayWork);
        this.view.bindAccept(this.handlerAcceptWork);
        this.view.bindCloseDetails();
    }
    handlerDisplayWork = (id) => {
        return this.service.getSelectedWorkData(id);
    }
    handlerAcceptWork = () => {
        this.service.setWorkerToWork();
    }
}