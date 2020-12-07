class userController{
    constructor(view,service){
        this.view = view;
        this.service = service;
        this.key;

        this.service.lockService.checkToken();
        this.init();
    }

    init = async () => {
        await this.initTables();
        this.view.bindChangePhoto(this.handlerChangePhoto);
        this.view.bindAcceptedRows(this.handlerDisplayWork);
        this.view.bindWaitingRows(this.handlerDisplayWork);
    }

    initTables = async () => {
        this.key = (await this.service.getCurrentUser()).sub;
        let data = await this.service.bringRelatedData(this.key);
        this.view.printTables(data);
        this.view.printProfileRatings(await this.service.bringProfileRatings());
    }

    bindInputs = () => {
        this.view.bindCloseDetails();
        this.view.bindEnd(this.handlerEnd);
        this.view.bindCancel(this.handlerCancel);
        this.view.bindRate(this.handlerRate);
    }

    handlerChangePhoto = (file) => {
        this.service.changePhoto(file)
    }

    handlerDisplayWork = async (id) => {
        let work = await this.service.getSelectedWorkData(id);
        this.bindInputs();
        this.view.displayRelatedWork(work);
    }
    handlerEnd = async () => {
        this.service.endWork();
        this.view.closeWorkDetails();
        let user = await this.service.getUserToRateData(this.view.accepted);
        this.view.printRatingDiv(user);
        this.view.GUI.ratingUserDiv.classList.add('easeIn');
    }
    handlerCancel = () => {
        this.service.cancelWork();
        swal("Trabajo cancelado","Ya no tienes nada que ver con esta tarea...","success")

    }
    handlerRate = async (data) => {
        this.view.closeWorkRating();
        this.service.rateUser(data);
        await this.initTables();
        swal("Usuario valorado","Grácias por hacer mejor esta comunidad, los demás leeran tu opinión sobre el.","success")
        
    }
}