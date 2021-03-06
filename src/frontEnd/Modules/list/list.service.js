class ListService {
    constructor(httpService,lockService){
        this.httpService = httpService;
        this.lockService = lockService;
        this.key= "";
        this.userInfo ="";
        this.works = [];
        this.selectedWork = "";
    }

    getCurrentUser = () => {
        let token = localStorage.getItem('token');
        return this.httpService.post("http://127.0.0.1:3003/verify",{"token":token})
        .then(data => data);
    }

     getLocalWorks = async (email) => {
        this.userInfo = await this.httpService.post("http://127.0.0.1:3003/user/location",{"email":email})
        .then(data=> JSON.parse(data).user);

        this.works = await this.httpService.post("http://127.0.0.1:3003/works/latest",{"lat":this.userInfo.lat,"lon":this.userInfo.lon}).then(data => JSON.parse(data).user);
        let html = this.works.reduce((html,job)=>{
            return html += '<section class="jobCard" id="'+job.idWork+'"><img class="jobImage" src="http://127.0.0.1:3003/works/getImage/'+job.idWork+'"><div class="info"><div class="infoUser"><img class="jobUserImage" src="'+job.userPhoto+'"><p id="'+job.idUser+'">'+job.userName+'</p><p>'+job.location+'</p><h3 class="price">Paga '+job.price+'€</h3></div><div class="infoJob"><h3>'+job.name+'</h3>'+this.createLabelsComponent(job.labels)+'<p class="title">'+job.description+'</p></div></div><div class="actions"><button class="accept-button">¡Yo lo hago!</button></div></section>'; 
        },"");
        return html;
    }; 


    getFilteredWorks = async (filter) => {
        this.works = await this.httpService.post("http://127.0.0.1:3003/works/filtered",{"filter":filter,"lat":this.userInfo.lat,"lon":this.userInfo.lon}).then(data => JSON.parse(data).user);
        let html = this.works.reduce((html,job)=>{
            return html += '<section class="jobCard" id="'+job.idWork+'"><img class="jobImage" src="http://127.0.0.1:3003/works/getImage/'+job.idWork+'"><div class="info"><div class="infoUser"><img class="jobUserImage" src="'+job.userPhoto+'"><p id="'+job.idUser+'">'+job.userName+'</p><p>'+job.location+'</p><h3 class="price">Paga '+job.price+'€</h3></div><div class="infoJob"><h3>'+job.name+'</h3>'+this.createLabelsComponent(job.labels)+'<p class="title">'+job.description+'</p></div></div><div class="actions"><button class="accept-button">¡Yo lo hago!</button></div></section>'; 
        },"");
        return html;
    }; 

    createLabelsComponent = (rawLabels) => {
        let labels = rawLabels.split(',');
        let labelsHtml = labels.reduce((html,label) =>{ return html += '<li class="tag">'+label+'</li>';},'<div class="tags"><ul>');
        labelsHtml += '</ul></div>';
        return labelsHtml;
    }

    getSelectedWorkData = (workId) => {
        let work = this.works.find(work=>work.idWork == workId);
        this.selectedWork = work;
        return work;
    }

    setWorkerToWork = () => {
        let idWork = this.selectedWork.idWork;
        let idWorker = this.userInfo.uuid;
        this.httpService.post('http://127.0.0.1:3003/works/setWorker',{"idWork":idWork,"idWorker":idWorker})
        .then(swal("¡Trabajo seleccionado!", "Mira en tu perfil para contactar con este usuario.", "success")); 
    }

}