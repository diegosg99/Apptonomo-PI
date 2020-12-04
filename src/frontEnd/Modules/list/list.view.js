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
            starring: document.getElementById('recruiter-starring'),
            accept: document.getElementById('accept'),
            closeDetails: document.getElementById('closeDetails'),
            searchInput: document.getElementById('searchInput')
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
        this.GUI.workDetails.classList.add('easeIn');
        //let section = e.target.parentNode.parentNode.id;
        this.GUI.recruiterImage.setAttribute('src',work.userPhoto);
        this.GUI.recruiterName.innerHTML = work.userName;
        this.GUI.workDesc.innerHTML = work.description;
        this.GUI.workLocation.innerHTML = work.location;
        this.GUI.workPay.innerHTML = work.price+"€";
        this.GUI.starring.innerHTML = (work.userRating)==null?"0/5":work.userRating+"/5";
        this.GUI.workLabels.innerHTML = work.labels;
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

    bindFilterInput = (handler) => {
        this.GUI.searchInput.addEventListener('keyup',(e)=>{
            handler(e.target.value);
            });
        
    }

}
