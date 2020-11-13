class LoginService {
    constructor(httpService,dexieService){
        this.httpService = httpService;
        this.dexieService = dexieService;
        this.localStorage = window.localStorage;
        this.key;
    }
    login = async ({email,password})=>{
        const jsonData = await this.httpService.post("http://127.0.0.1:3003/login/user",{email:email,password:password});
        const data = JSON.parse(jsonData);
        
        const token = data.token;
        this.key = data.user.email;
        this.localStorage.setItem('token',token);
        this.checkPassword(password,data.user.password) ? window.location.hash = 'list' :this.errorMsg();
    }
    register = (user)=>{
        this.httpService.post("http://127.0.0.1:3003/register/user",user);
    }

    checkPassword = (writed,stored)=>{
            return writed===stored;   
    }
    errorMsg = () => {
        alert('Las credenciales no son correctas...')
    }
}