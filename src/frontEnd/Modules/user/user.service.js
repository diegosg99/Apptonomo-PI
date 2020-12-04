class userService {
    constructor(lockService,httpService){
        this.lockService = lockService;
        this.httpService = httpService;
        this.info;
        this.accepted;
        this.waiting;
        this.selectedWork;
    }
    getCurrentUser = () => {
        let token = localStorage.getItem('token');
        return this.httpService.post("http://127.0.0.1:3003/verify",{"token":token})
        .then(JSON.parse);
    }
    bringRelatedData = async(email) => {
        this.info = await this.httpService.post("http://127.0.0.1:3003/profile/user/info",{email:email}).then(JSON.parse)
        let id = this.info.uuid;

        this.accepted = await this.httpService.post("http://127.0.0.1:3003/profile/user/accepted",{id:id}).then(JSON.parse)
        this.waiting = await this.httpService.post("http://127.0.0.1:3003/profile/user/waiting",{id:id}).then(JSON.parse)
        
        let info = this.info;
        let accepted = this.accepted;
        let waiting = this.waiting;
        return {info,accepted,waiting}
    }
    changePhoto = async (base64) => {
        await this.httpService.post('http://127.0.0.1:3003/profile/user/photo',{"photo":base64,"id":this.info.uuid})
        .then(res=>JSON.parse(res).msg=='Error'?swal("Error al cambiar de foto","No se ha podido cambiar la foto, intentalo de nuevo...","succes"):swal("Foto cambiada","Hemos cambiado tu foto de perfil, ¡Lúcete publicando un trabajo!","success"));
    }
    getSelectedWorkData = async (workId) => {
        this.selectedWork = await this.httpService.get("http://127.0.0.1:3003/works/getWork/"+workId).then(JSON.parse);
        return this.selectedWork;
    }
    endWork = (id) => {
        this.httpService.post("",id);
    }
    
    cancelWork = (id) => {
        let idWork = this.selectedWork.idWork;
        let idUser = this.info.uuid;
        (idUser === this.selectedWork.idUser) ? this.cancelMyWork(idWork) : this.cancelAsWorker(idWork);
    }
//TODO become delete.
    cancelMyWork = (id) => {
        this.httpService.post("http://127.0.0.1:3003/profile/work/cancel",{"id":id});
    }
     cancelAsWorker = (id) => {
        this.httpService.post("http://127.0.0.1:3003/profile/work/quitWorker",{"id":id});

     }

 /*    rateUser = (data) => {
        this.httpService.post("",data);
    } */
}