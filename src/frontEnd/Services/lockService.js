class lockService{
    constructor(httpService){
        this.key;
        this.httpService = httpService;
        this.checkToken();
    }

    checkToken = async () => {
        if (localStorage.getItem('token')){
            const token = localStorage.getItem('token');

            const json = await this.httpService.post("http://127.0.0.1:3003/verify",{token:token});
            const data = JSON.parse(json);
            if (data.sub){
                this.key = data.sub;
                return this.key;
            }
        }    
        else{
            window.location.hash = 'exit';
        }
    }
}