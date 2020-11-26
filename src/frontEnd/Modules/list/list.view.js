class ListView {
    constructor(){
        this.GUI = {
            jobList:document.getElementById("jobList"),
            workDetails:document.getElementById('workDetails'),
            recruiterImage: document.getElementById('recruiterImage'),
            recruiterName: document.getElementById('recruiterName'),
            workName: document.getElementById('workName'),
            workLocation: document.getElementById('workLocation'),
            workPay: document.getElementById('workPay'),
            workLabels: document.getElementById('workLabels'),
            workDesc: document.getElementById('workDesc'),
            workImage: document.getElementById('workImage'),
            starring: document.getElementById('starring'),
            accept: document.getElementById('accept'),
            closeDetails: document.getElementById('closeDetails')
        };
    }
    printJobs = (jobs) =>{
        this.GUI.jobList.innerHTML = jobs;
    }
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
    displayWorkDetails = (work,e) => {
        console.log(work);
        this.GUI.workDetails.classList.add('easeIn');
        let section = e.target.parentNode.parentNode.id;
        this.GUI.recruiterImage.setAttribute('src',work.userPhoto);
        this.GUI.recruiterName.innerHTML = work.userName;
        this.GUI.workDesc.innerHTML = work.description;
        this.GUI.workLocation.innerHTML = work.location;
        this.GUI.workPay.innerHTML = work.price;
        this.GUI.workLabels.innerHTML = work.labels;
        this.GUI.workImage.setAttribute('src',"");
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
}
