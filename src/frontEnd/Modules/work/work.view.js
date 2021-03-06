class WorkView{
    constructor(){
        this.GUI = {
            userName:document.getElementById('userName'),
            userLocation:document.getElementById('userLocation'),
            jobName:document.getElementById('jobName'),
            jobDesc:document.getElementById('jobDesc'),
            jobLabels:document.getElementById('jobLabels'),
            jobPay:document.getElementById('jobPay'),
            createJob:document.getElementById('createJob'),
            address:document.getElementById('address'),
            bloque:document.getElementById('bloque'),
            casa:document.getElementById('casa'),
            photo: document.getElementById('upload')
        }
    }

   printUserData = (json) => {
        const data = JSON.parse(json);
        this.GUI.userName.innerHTML = data.user.name;
        this.GUI.userLocation.innerHTML = data.user.address;
    }

    bindCreateButton = (handler) => {
        this.GUI.createJob.addEventListener('click',async ()=>{
            handler(await this.getWorkInputs());
        })
    }

    getWorkInputs = async () =>{
        const jobName = this.GUI.jobName.value;
        const jobDesc = this.GUI.jobDesc.value;
        const jobLabels = this.GUI.jobLabels.value;
        const jobPay = this.GUI.jobPay.value;
        const photo = await this.toBase64(this.GUI.photo.files[0]);
        const userLocation = this.GUI.address.value +", bloque "+ this.GUI.bloque.value+", casa "+this.GUI.casa.value;
        return {jobName:jobName,jobDesc:jobDesc,jobLabels:jobLabels,jobPay:jobPay,userLocation:userLocation,photo:photo}
    }

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}