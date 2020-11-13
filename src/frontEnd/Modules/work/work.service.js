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
    uploadWork = ({jobName,jobDesc,jobLabels,jobPay,userLocation}) =>{
        console.log(jobPay,jobLabels,jobDesc);
        const job = new Job(this.user.uuid,jobName,jobDesc,userLocation,this.mapService.lat,this.mapService.lon,jobPay,jobLabels);
        this.httpService.post('http://127.0.0.1:3003/create/job',job).then(console.log('Trabajo creado.'));
    }

    

}