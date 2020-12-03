class MapService {
    constructor(httpService){
        this.httpService = httpService;
        this.GUI = {
            address:document.getElementById('address'),
            info:document.getElementById('info'),
            locationButtons:document.getElementById('locationButtons'),
            popup: L.popup()
        }
        this.lat;
        this.lon;
        this.initMap(this.onMapClick);

        this.accept = document.getElementById("acceptLocation");
        this.deny = document.getElementById("denyLocation");
        this.bindLocationButtons([this.handlerAccept,this.handlerDeny]);
    }

    onMapClick= (e) => {
        this.GUI.map.removeLayer(this.GUI.marker);
        this.lat = e.latlng.lat;
        this.lon = e.latlng.lng;
        
        this.GUI.info.innerHTML = "¿Confirmas la direccion?";
        this.GUI.locationButtons.removeAttribute('hidden');
        
        this.GUI.marker = L.marker([this.lat,this.lon]).addTo(this.GUI.map);
        this.GUI.popup.setLatLng([this.lat,this.lon]).setContent("<p>Latitud: "+this.lat+"</p><p> Longitud: "+this.lon+"<br></p>¿Este es el sitio?<br>").openOn(this.GUI.map);
    }
    
    bindLocationButtons= () =>{
        this.accept.addEventListener("click",this.handlerAccept); 
        this.deny.addEventListener("click",this.handlerDeny);
    }
    
    initMap = (handler)=> {
        this.GUI.map = L.map('mapid').setView([36.719444, -4.420000], 13);
        const attribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tiles = L.tileLayer(tileUrl, { attribution });
        tiles.addTo(this.GUI.map);

        this.GUI.map.on('click', handler);
        this.setUserLocation({x:36.719444, y:-4.420000});
    }
    
    setUserLocation = (loc) => {
        this.GUI.marker = L.marker([loc.x,loc.y]).addTo(this.GUI.map);
        this.GUI.marker.bindPopup("<b>¡Esta es tu ubicación predeterminada!</b><br>¿Quieres dejar esta? (Haz click donde desees...)").openPopup();
        this.lat = loc.x;
        this.lon = loc.y;
    }

    handlerAccept = () => {
        let url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+this.lat+'&lon='+this.lon+'&zoom=17';
        this.httpService.get(url)
        .then((location) => JSON.parse(location))
        .then(({address}) => this.GUI.address.value = address.road+", "+address.neighbourhood+", "+address.city+", "+address.state)
        .then(this.GUI.info.innerHTML = "¡Se ha marcado el destino!")
        .then(this.GUI.locationButtons.setAttribute('hidden',true))
        .then(this.displayInfo());
    }

    handlerDeny = () => {
        alert("Haz click en tu domicilio...")
    }

    displayInfo = () => {

    }
}
//const mapService = new MapService(new httpService());