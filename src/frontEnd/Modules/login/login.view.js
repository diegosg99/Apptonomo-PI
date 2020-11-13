class LoginView {
   constructor (){
       this.GUI = {
           loginButton:document.getElementById('loginButton'),
           registerButton:document.getElementById('registerButton'),
           login:document.getElementById('loginForm'),
           register:document.getElementById('registerForm'),
           nick:document.getElementById('nick'),
           name:document.getElementById('name'),
           emailLogin:document.getElementById('login-email'),
           passwordLogin:document.getElementById('login-password'),
           emailRegister:document.getElementById('register-email'),
           passwordRegister:document.getElementById('register-password'),
           address:document.getElementById('address'),
           bornDate:document.getElementById('bornDate'),
           photo:document.getElementById('registerForm'),
           loginSubmit: document.getElementById('loginSubmit'),
           registerSubmit: document.getElementById('registerSubmit'),
           popup: L.popup()
        };

        this.lat = 0;
        this.lon = 0;

        this.accept = document.getElementById("acceptLocation");
        this.deny = document.getElementById("denyLocation");
        this.bindLoginButtons();
   } 

    onMapClick= (e) => {
            this.lat = e.latlng.lat;
            this.lon = e.latlng.lng;
            this.GUI.popup.setLatLng([this.lat,this.lon]).setContent("<p>Latitud: "+this.lat+"</p><p> Longitud: "+this.lon+"<br></p>¿Es aquí?<br>").openOn(this.GUI.map);
    }

   bindLocationButtons= ([handlerAccept,handlerDeny]) =>{
       this.accept.addEventListener("click",handlerAccept); 
       this.deny.addEventListener("click",handlerDeny);
    }

   initMap = ()=> {
    this.GUI.map = L.map('mapid').setView([36.719444, -4.420000], 13);
	const attribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
          tiles.addTo(this.GUI.map);
	this.GUI.marker = L.marker([36.719444, -4.420000]).addTo(this.GUI.map);
		this.GUI.marker.bindPopup("<b>¡Bienvenido!</b><br> Haz click en tu domicilio...").openPopup();
		this.GUI.map.on('click', this.onMapClick);
   }
    
   switchPanels = (panel) => {
    panel === 'registerButton' ? this.show(true) : this.show(false);
    }

    show = (register) => {
        if (register){
                this.GUI.login.removeAttribute("class");
                this.GUI.login.setAttribute('class','invisible');
                this.GUI.register.setAttribute('class','register');
        }else{
            this.GUI.register.removeAttribute("class");
            this.GUI.register.setAttribute('class','invisible');
                this.GUI.login.setAttribute('class','login');
        }
    }

   bindLoginButtons = () => {
        this.GUI.loginButton.addEventListener('click',(e)=>{
        this.switchPanels(e.target.id);
        });
        this.GUI.registerButton.addEventListener('click',(e)=>{
        this.switchPanels(e.target.id);
        });
    }
    bindSubmitButton = () => {
        this.GUI.loginButton.addEventListener('click',(e)=>{
        this.switchPanels(e.target.id);
        });
        this.GUI.registerButton.addEventListener('click',(e)=>{
        this.switchPanels(e.target.id);
        });
    }

    bindSubmitLogin = (handler) => {
        this.GUI.loginSubmit.addEventListener('click',(e)=>{
            e.preventDefault();
            const email = this.GUI.emailLogin.value;
            const password = this.GUI.passwordLogin.value;
            handler({email:email,password:password});
        })
    }
    bindSubmitRegister = (handler) => {
        this.GUI.registerSubmit.addEventListener('click',(e)=>{
            e.preventDefault();
            handler(this.getRegisterData());
        })
    }
    getRegisterData = () => {
        let lat = this.lat;
        let lon = this.lon;
        const name = this.GUI.name.value;
        const nick = this.GUI.nick.value;
        const email = this.GUI.emailRegister.value;
        const password = this.GUI.passwordRegister.value;
        const address = this.GUI.address.value;
        const bornDate = this.GUI.bornDate.value;
        const photo = this.GUI.photo.value;
        return new User(nick,name,email,password,address,lat,lon,bornDate,photo);
    }
}