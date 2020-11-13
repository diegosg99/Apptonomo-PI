class ListController {
    constructor(view,service){
        this.view = view;
        this.service = service;
        this.key;
        this.initList();
        //this.getLatestJobs();
    }

    getLatestJobs = () => {
        this.view.printJobs(this.service.getLocalWorks());
    }

    initList = async () => {
        let userData = await this.service.getCurrentUser();
        this.key = JSON.parse(userData).sub;
        let html = await this.service.getLocalWorks(this.key);
        this.view.printJobs(html);
    }
}