class userView {
    constructor(){
        this.GUI = {
            worksWaitingTable:document.getElementById('worksWaitingTable'),
            worksAcceptedTable: document.getElementById('worksAcceptedTable'),
            userPhoto:document.getElementById('userImage'),
            userName:document.getElementById('userName'),
            starring:document.getElementById('starNumber'),
            userLocation:document.getElementById('userLocation'),
            changeImage: document.getElementById('changeImageLabel'),
            workDetails: document.getElementById('workDetails'),
            recruiterImage: document.getElementById('recruiterImage'),
            recruiterName: document.getElementById('recruiterName'),
            workName: document.getElementById('workName'),
            workLocation: document.getElementById('workLocation'),
            workPay: document.getElementById('workPay'),
            userStar: document.getElementById('starNumber'),
            workLabels: document.getElementById('workLabels'),
            workDesc: document.getElementById('workDesc'),
            workImage: document.getElementById('workImage'),
            starring: document.getElementById('recruiter-starring'),
            end: document.getElementById('end'),
            cancel: document.getElementById('cancel'),
            rate: document.getElementById('rate'),
            closeDetails: document.getElementById('closeDetails'),
            ratingUserDiv: document.getElementById('ratingUserDiv'),
            ratingDisplay: document.getElementById('ratingDisplay'),
            ratingUserImage: document.getElementById('ratingUserImage'),
            ratingRecruiterName: document.getElementById('ratingRecruiterName'),
            ratingRecruiterLocation: document.getElementById('ratingRecruiterLocation'),
            rateDesc: document.getElementById('rateDesc'),
            phone: document.getElementById('phone')

        }
        this.accepted;
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
    this.GUI.userStar.innerHTML = (info.rating)==null?0+"/5":info.rating.toFixed(1)+"/5";
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
            let tr = this.createAcceptedTag(work,true);
            tbody.appendChild(tr);
        });
    }
    createAcceptedTag = (work,accepted) => {
        let tr = document.createElement("tr");
        tr.setAttribute('id',work.idWork);
        tr.setAttribute('class',accepted?"accepted":'waiting');
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
            let tr = this.createAcceptedTag(work,false);
            tbody.appendChild(tr);
        });
    }
    displayRelatedWork = (work) => {
        this.GUI.workDetails.classList.add('easeIn');
        this.GUI.recruiterImage.setAttribute('src',work.userPhoto);
        this.GUI.recruiterName.innerHTML = work.userName;
        this.GUI.workDesc.innerHTML = work.description;
        this.GUI.workLocation.innerHTML = work.location;
        this.GUI.workPay.innerHTML = work.price+"€";
        this.GUI.phone.innerHTML = work.phone;
        this.GUI.starring.innerHTML = (work.userRating)==null?"0/5":work.userRating+"/5";
        this.GUI.workLabels.innerHTML = work.labels;
        work.idWork != undefined ? this.GUI.workImage.setAttribute('src',"http://127.0.0.1:3003/works/getImage/"+work.idWork):this.GUI.workImage.setAttribute('src',"");

        this.GUI.workName.innerHTML = work.name;
    }

    bindAcceptedRows = (handler,accepted) => {
        let rows = Array.from(document.getElementsByClassName('accepted'));
        rows.forEach(row=>{
            row.addEventListener('click',(e)=>{
                this.accepted=true;
                handler(e.target.parentNode.id,accepted)
            })
        });
    }

    bindWaitingRows = (handler,accepted) => {
        let rows = Array.from(document.getElementsByClassName('waiting'));
        rows.forEach(row=>{
            row.addEventListener('click',(e)=>{
                this.accepted = false;
                let work = handler(e.target.parentNode.id,accepted);
                this.displayRelatedWork(work);
            })
        });
    }


bindChangePhoto = (handler) => {
    this.GUI.changeImage.addEventListener('change',(e)=>{
    this.toBase64(e.target.files[0])
    .then(base64 => handler(base64));
    this.toBase64(e.target.files[0])
    .then(base64=>this.GUI.userPhoto.setAttribute("src",base64))
    })
}


bindCloseDetails = () => {
    this.GUI.closeDetails.addEventListener('click',e=>{
        this.closeWorkDetails();
    })
}

bindEnd = (handler) => {
    this.GUI.end.addEventListener('click',e => {
        handler();
    })
}

bindCancel = (handler) => {
    this.GUI.cancel.addEventListener('click',e => {
        handler();
        this.closeWorkDetails();
    })
}
bindRate = (handler) => {
    this.GUI.rate.addEventListener('click',e => {
        let data = this.getRateValues();
        handler(data);
    })
}

closeWorkDetails = () => {
    this.GUI.workDetails.classList.remove('easeIn');
}
closeWorkRating = () => {
    this.GUI.ratingUserDiv.classList.remove('easeIn');
}

toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
printRatingDiv = (user) => {
    this.GUI.ratingRecruiterName.innerHTML = user.name;
    this.GUI.ratingRecruiterLocation.innerHTML = user.address;
    this.GUI.ratingUserImage.setAttribute("src",user.photo);
    this.GUI.ratingDisplay.innerHTML = user.rating;

}

getRateValues = () =>{
    let desc = this.GUI.rateDesc.value;
    let rate = this.getRadioValue();
    return {desc,rate}
}

getRadioValue = () => {
    let radios = document.getElementsByName('rate');
    let value = Object.values(radios).filter(radio=>radio.checked)[0].value;
    return value;
}

}

