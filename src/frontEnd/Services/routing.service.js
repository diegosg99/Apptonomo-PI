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

        window.addEventListener('hashchange',async (e) => {
        this.url = window.location.hash;
        await this.render(this.url)
        });

        //location.hash = '#';
        this.render(this.url); 
                
   }            

   render = async  (url) => {
       let path = 'Templates/' + this.routes[url] + '.html';
       console.log(path);
    let data = await fetch(path)
       .then(response => {return response.text()})
    this.container.innerHTML = data;
    this.completeScripts(url);
   }

   completeScripts = (url) => {
    let moduleToLoad = 'Modules/'+this.routes[url]+"/";
    let service = moduleToLoad+this.routes[url]+".service.js"
    let view = moduleToLoad+this.routes[url]+".view.js"
    let controller = moduleToLoad+this.routes[url]+".controller.js"
    let app = moduleToLoad+this.routes[url]+".app.js"

    this.loadeds.includes(this.routes[this.url]) ? this.loadeds : this.loadeds = [...this.loadeds,this.routes[this.url]];

    this.removeUnusedScripts();
    setTimeout(500);
     this.createScriptTag(service);
    setTimeout(500);
     this.createScriptTag(view);
    setTimeout(500);
     this.createScriptTag(controller);
    setTimeout(500);
     this.createScriptTag(app);   
   }

   createScriptTag = (url) => {
       console.log(url);
       let script = document.createElement("script"); 
       script.setAttribute('src',url);
       script.setAttribute('class',this.routes[this.url]);
       document.body.append(script);
   }

   removeUnusedScripts = () => {
       const unused = this.loadeds.filter(hash => hash != this.routes[this.url]);
       for (let hash of unused){
           document.querySelectorAll('.'+hash).forEach(function(elem){
               elem.remove();
               })
       }
   }
   
}