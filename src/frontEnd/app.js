/**
* Este archivo instancia el RoutingService al inicio, para ir implementando los módulos solicitados
*/
class apptonomo {
    constructor(routingService){
        this.routingService = routingService
    }

    init = async () => {
        await this.routingService.render()
       }

}
const app = new apptonomo(new RoutingService());
app.init();
