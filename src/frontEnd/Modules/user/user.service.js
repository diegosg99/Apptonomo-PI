class userService {
    constructor(lockService,httpService){
        this.lockService = lockService;
        this.httpService = httpService;
        this.info;
    }
    getCurrentUser = () => {
        let token = localStorage.getItem('token');
        return this.httpService.post("http://127.0.0.1:3003/verify",{"token":token})
        .then(JSON.parse);
    }
    bringRelatedData = async(email) => {
        this.info = await this.httpService.post("http://127.0.0.1:3003/profile/user/info",{email:email}).then(JSON.parse)
        let id = this.info.uuid;
        let accepted = await this.httpService.post("http://127.0.0.1:3003/profile/user/accepted",{id:id}).then(JSON.parse)
        let waiting = await this.httpService.post("http://127.0.0.1:3003/profile/user/waiting",{id:id}).then(JSON.parse)
        let info = this.info;
        return {info,accepted,waiting}
    
    }
    changePhoto = (base64) => {
        console.log(base64);
        this.httpService.post('http://127.0.0.1:3003/profile/user/photo',{"photo":base64,"id":this.info.uuid})
        .then(res=>res=='Error'?swal("Error al cambiar de foto","No se ha podido cambiar la foto, intentalo de nuevo...","succes"):swal("Foto cambiada","Hemos cambiado tu foto de perfil, ¡Lúcete publicando un trabajo!","success"));
    }
}