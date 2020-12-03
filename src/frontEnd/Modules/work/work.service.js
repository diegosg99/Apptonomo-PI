class WorkService{
    constructor(httpService,dexieService,lockService,mapService){
        this.httpService = httpService;
        this.dexieService = dexieService;
        this.lockService = lockService;
        this.mapService = mapService;
        this.user;
    }
    
    initMap = () => {
        this.mapService.initMap();
        this.mapService.bindLocationButtons();
    }

    getUserData = async ()=>{
        const email = await this.lockService.checkToken();
        const data = await this.httpService.post("http://127.0.0.1:3003/data/user",{email:email});
        this.user = JSON.parse(data).user;
        return data;
    }
    uploadWork = ({jobName,jobDesc,jobLabels,jobPay,userLocation,photo}) =>{
        const job = new Job(this.user.uuid,jobName,jobDesc,userLocation,this.mapService.lat,this.mapService.lon,jobPay,jobLabels,photo);
        this.httpService.post('http://127.0.0.1:3003/create/job',job).then(JSON.parse)
        .then(({msg})=>msg==="Error"?swal("Fallo al subir trabajo","La foto puede no soportar un tamaño tan grande.","error","Probare de nuevo"):swal("Has subido el trabajo","¡Espera a que lo soliciten!","succes"));
    }

    

}