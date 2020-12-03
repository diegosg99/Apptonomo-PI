class userView {
    constructor(){
        this.GUI = {
            worksWaitingTable:document.getElementById('worksWaitingTable'),
            worksAcceptedTable: document.getElementById('worksAcceptedTable'),
            userPhoto:document.getElementById('userImage'),
            userName:document.getElementById('userName'),
            starring:document.getElementById('starNumber'),
            userLocation:document.getElementById('userLocation'),
            changeImage: document.getElementById('changeImageLabel')
        }
    }
    printTables = ({info,accepted,waiting}) => {
        this.refreshInfo(info)
        this.printAcceptedWorks(accepted);
        this.printWaitingWorks(waiting);

    }

   refreshInfo = (info) => {
    let id = info.uuid;
    this.GUI.userPhoto.setAttribute('src',"http://127.0.0.1:3003/users/getImage/"+id);
    this.GUI.userName.innerHTML = info.name;
    this.GUI.userLocation.innerHTML = info.address;
    this.GUI.starring.innerHTML = (info.rating)==null?0+"/5":info.rating+"/5";
   }

    printAcceptedWorks = (accepted) => {
        let tbody = this.GUI.worksAcceptedTable;

        tbody.innerHTML = "";

        let head = document.createElement("tr");
        let td = document.createElement("th");
        let text = document.createTextNode("Tareas pendientes");
  
        td.appendChild(text);
        head.appendChild(td);
        tbody.appendChild(head);

        let row = document.createElement("tr");
        let td1 = document.createElement("th");
        let td2 = document.createElement("th");
        let text1 = document.createTextNode("Nombre");
        let text2 = document.createTextNode("precio (€)");
  
        td1.appendChild(text1);
        td2.appendChild(text2);
        row.appendChild(td1);
        row.appendChild(td2);
        tbody.appendChild(row);
        
        accepted.forEach(work=>{
            let tr = this.createAcceptedTag(work);
            tbody.appendChild(tr);
        });
    }
    createAcceptedTag = (work) => {
        let tr = document.createElement("tr");
        tr.setAttribute('id',work.idWork);
        tr.addEventListener('click',(e)=>{this.displayRelatedWork(e)});
        work = {name:work.name,price:work.price};
        Object.values(work).forEach(val=>{
            let td = document.createElement("td");
            let text = document.createTextNode(val);
            td.appendChild(text);
            tr.appendChild(td);
        })
        return tr;
    }

    printWaitingWorks = (waiting) => {
        let tbody = this.GUI.worksWaitingTable;

        tbody.innerHTML = "";

        let head = document.createElement("tr");
        let td = document.createElement("th");
        let text = document.createTextNode("Trabajos publicados");
  
        td.appendChild(text);
        head.appendChild(td);
        tbody.appendChild(head);

        let row = document.createElement("tr");
        let td1 = document.createElement("th");
        let td2 = document.createElement("th");
        let text1 = document.createTextNode("Nombre");
        let text2 = document.createTextNode("precio (€)");
  
        td1.appendChild(text1);
        td2.appendChild(text2);
        row.appendChild(td1);
        row.appendChild(td2);
        tbody.appendChild(row);
        
        waiting.forEach(work=>{
            let tr = this.createAcceptedTag(work);
            tbody.appendChild(tr);
        });
    }
    displayRelatedWork = (e) => {
        console.log(e.target.parentNode.id);
    }



//________________________________________

bindAcceptWorkButton = (handler) =>{
    let buttons = Array.from(document.getElementsByClassName('accept-button'));
    buttons.forEach(button => {
        button.addEventListener('click',(e)=>{
            let id = e.target.parentNode.parentNode.id;
            let work = handler(id);
            this.displayWorkDetails(work,e);
        });    
    });
}

bindChangePhoto = (handler) => {
    this.GUI.changeImage.addEventListener('change',(e)=>{
    this.toBase64(e.target.files[0])
    .then(console.log)
    .then(base64=>this.GUI.userPhoto.setAttribute("src",base64))
    .then(base64 => handler(base64))
    })
}

displayWorkDetails = (work,e) => {
    this.GUI.workDetails.classList.add('easeIn');
    let section = e.target.parentNode.parentNode.id;
    this.GUI.recruiterImage.setAttribute('src',work.userPhoto);
    this.GUI.recruiterName.innerHTML = work.userName;
    this.GUI.workDesc.innerHTML = work.description;
    this.GUI.workLocation.innerHTML = work.location;
    this.GUI.workPay.innerHTML = work.price+"€";
    this.GUI.starring.innerHTML = (work.userRating)==null?"0/5":work.userRating+"/5";
    this.GUI.workLabels.innerHTML = work.labels;
    console.log(work.id);
    this.GUI.workImage.setAttribute('src',"http://127.0.0.1:3003/works/getImage/"+work.idWork);
    this.GUI.workName.innerHTML = work.name;
}

bindCloseDetails = () => {
    this.GUI.closeDetails.addEventListener('click',e=>{
        this.closeWorkDetails();
    })
}

bindAccept = (handler) => {
    this.GUI.accept.addEventListener('click',e => {
        this.closeWorkDetails();
        handler();
    })
}
closeWorkDetails = () => {
    this.GUI.workDetails.classList.remove('easeIn');
}

toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
}