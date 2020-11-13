class ListView {
    constructor(){
        this.GUI = {
            jobList:document.getElementById("jobList")
        };
    }
    printJobs = (jobs) =>{
        console.log("printing...");
        document.getElementById("jobList").innerHTML = jobs;
    }
}
