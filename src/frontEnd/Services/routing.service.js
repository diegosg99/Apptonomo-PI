class RoutingService {
constructor(){
       this.url = "#";
       this.container = window.document.getElementById('content');
       this.loadeds = [];
       this.routes = {
           '#':'login',
           '#list':"list",
           '#work':"work",
           '#user': "user",
           '#exit': 'login'
           }


        window.location.hash = '#';

        window.addEventListener('hashchange',(e) => {
            e.preventDefault();
            this.url = window.location.hash;
            this.render()
        });
        this.render(); 
                
   }            

   render = async  () => {
       let path = 'Templates/' + this.routes[this.url] + '.html';
    fetch(path)
    .then(response=>response.text())
    .then(html => this.container.innerHTML = html)
    .then(this.completeScripts(this.url))
}

   completeScripts = () => {
    let moduleToLoad = 'Modules/'+this.routes[this.url]+"/";
    let service = moduleToLoad+this.routes[this.url]+".service.js"
    let view = moduleToLoad+this.routes[this.url]+".view.js"
    let controller = moduleToLoad+this.routes[this.url]+".controller.js"
    let app = moduleToLoad+this.routes[this.url]+".app.js"

    this.loadeds = this.loadeds.includes(this.routes[this.url]) ? this.loadeds : [...this.loadeds,this.routes[this.url]];

    this.removeUnusedScripts();
     this.createScriptTag(service);
     this.createScriptTag(view);
     this.createScriptTag(controller);
     this.createScriptTag(app);   
   }

   createScriptTag = (url) => {
    let script = document.createElement("script"); 
       script.setAttribute('src',url);
       script.setAttribute('class',this.routes[url]);
       document.body.append(script);
   }

   removeUnusedScripts = () => {
       const unused = this.loadeds.filter(hash => hash != this.routes[this.url]);
       for (let hash of unused){
           document.querySelectorAll('.'+hash).forEach(elem => {elem.remove();})
       }
   }
}