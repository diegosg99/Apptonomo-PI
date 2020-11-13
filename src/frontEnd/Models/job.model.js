class Job {
      constructor(idUser,name,description,location,lat,lon,price,labels,photo = null,idWorker = null,done = false,idUserRating = null,idWorkerRating = null){
          
        this.idWork = this.uuidv4();
        this.idUser = idUser;
        this.idWorker = idWorker;	
        this.name	= name;
        this.location = location;
        this.lat = lat;
        this.lon = lon;
        this.labels	= labels;
        this.description	= description;	
        this.price = price;	
        this.photo = photo;
        this.done = done;	
        this.idUserRating = idUserRating;
        this.idWorkerRating = idWorkerRating;
      }
     
      uuidv4() {
          return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (
              c ^
              (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
          );
      }
  }