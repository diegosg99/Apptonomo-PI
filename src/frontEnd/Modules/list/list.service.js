class ListService {
    constructor(httpService,dexieService,lockService){
        this.httpService = httpService;
        this.dexieService = dexieService;
        this.lockService = lockService;
        this.key= "";
        this.userInfo ="";
    }

    getCurrentUser = () => {
        let token = localStorage.getItem('token');
        return this.httpService.post("http://127.0.0.1:3003/verify",{"token":token})
        .then(data => data);
    }

    getLocalWorks = async (email) => {
        let userInfo = await this.httpService.post("http://127.0.0.1:3003/user/location",{"email":email})
        .then(data=> JSON.parse(data).user);
        let userNearJobsJSON = await this.httpService.post("http://127.0.0.1:3003/works/latest",{"lat":userInfo.lat,"lon":userInfo.lon});
        let userNearJobs = JSON.parse(userNearJobsJSON).user;
        let html = "";
        userNearJobs.forEach(job => {
            html += '<section class="jobCard"><img class="jobImage" src="./Assets/images/lavabo.webp"><div class="info"><div class="infoUser"><p>Diego Silva Gómez</p><p>Santa Barbara, Plaza Juan Gómez Bloque 8 Bajo 2</p><h3 class="price">20€</h3></div><div class="infoJob"><h3>Arreglar la tubería de mi baño</h3><div class="tags"><ul><li class="tag">Fontanero</li><li class="tag">Rápido</li></ul></div><p class="title">Necesito a alguien que me arregle un agujero en la tubería y que sea capaz de soldarlo.</p></div></div><div class="actions"><button class="accept-button">¡Yo lo hago!</button></div></section> '; 
        });
        return html;
    };
}