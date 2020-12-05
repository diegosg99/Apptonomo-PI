class userService {
    constructor(lockService,httpService){
        this.lockService = lockService;
        this.httpService = httpService;
        this.info;
        this.userToRate;
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

    getUserToRateData = async (accepted) => {
        let idRated = accepted ? this.selectedWork.idUser:this.selectedWork.idWorker;
        console.log(idRated);
        this.userToRate = await this.httpService.get("http://127.0.0.1:3003/profile/getUser/"+idRated).then(JSON.parse);        
        return this.userToRate;
    }

    endWork = () => {
        this.httpService.post("http://127.0.0.1:3003/profile/work/cancel",{"id":this.selectedWork.idWork});        
    }
    
    cancelWork = () => {
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

     rateUser = async (data) => {
        let rating = new Rating(this.selectedWork.idWork,data.rate,this.info.uuid,this.userToRate.uuid,data.desc);
        this.httpService.post("http://127.0.0.1:3003/profile/rate/user",rating);
        this.updateUserRate(data);
    }
    realRate = (actual,rates) => {
        let sumArray = rates.reduce((rate,{starring})=>{
            return rate+starring;
        },0);
        let sum =(sumArray+parseInt(actual));
        let res = sum/(rates.length+1);
        return res;
    }
    updateUserRate = async (data) => {
        let ratings = JSON.parse(await this.httpService.get("http://127.0.0.1:3003/profile/rates/getAll/"+this.userToRate.uuid));
        let starring = (ratings.rows.length === 0) ? data.rate : this.realRate(data.rate,ratings.rows);
        let id = this.userToRate.uuid;
        this.httpService.post("http://127.0.0.1:3003/profile/rate/refresh",{starring,id});
    }
}