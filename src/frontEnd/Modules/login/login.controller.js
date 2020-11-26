class LoginController {
    constructor(view,service){
        this.view = view;
        this.service = service;
        this.view.bindSubmitLogin(this.handlerSubmitLogin);
        this.view.bindSubmitRegister(this.handlerSubmitRegister);
        this.view.initMap();
        this.view.bindLocationButtons([this.handlerAccept,this.handlerDeny]);
    }
    registerNewUser = () => {
        const user = this.view.getRegisterData();
        this.service.register(user);
    }
    handlerSubmitLogin = (data) => {
        this.service.login(data);
    }

    handlerSubmitRegister = (data) => {
        this.service.register(data);
    }
    handlerAccept = () => {
        let popup = document.createElement("div");
        let text = document.createTextNode("¡Se ha añadido tu domicilio!");
        popup.appendChild(text);
        popup.setAttribute('class','show');
        popup.id = "alert";
        
        let url = "https://nominatim.openstreetmap.org/reverse?format=json&lat="+this.view.lat+"&lon="+this.view.lon+"&zoom=18&addressdetails=1";
        this.service.httpService.get(url)
        .then((location) => JSON.parse(location))
        .then(({address}) => this.view.GUI.address.value = address.borough+", "+address.city+", "+address.country+" "+address.postcode)
        .then(document.getElementById("info").innerHTML = "")
        .then(document.getElementById("info").appendChild(popup));
    }
   handlerDeny = () => {
        alert("Haz click en tu domicilio...")
   }
}

