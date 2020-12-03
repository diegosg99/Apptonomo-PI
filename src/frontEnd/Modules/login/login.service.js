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
    register = async (user)=>{
        this.httpService.post("http://127.0.0.1:3003/register/user",await user)
        .then(JSON.parse())
        .then(({msg})=>msg==="Error"?swal("Fallo en el registro","O la foto pesa demasiado o estas usando un email ya existente","error","Probare de nuevo"):swal("Te has registrado","¡Empieza a ganar dinero!","succes"));
        }

    checkPassword = (writed,stored)=>{
            return writed===stored;   
    }
    errorMsg = () => {
        swal('Fallo al iniciar sesion',"Las credenciales introducidas no son correctas...","Error")
    }
}