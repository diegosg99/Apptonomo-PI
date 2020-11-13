class User {
      constructor(nick,name,email,password,address,lat,lon,date,photo = null,rating = null){
          
          this.uuid	= this.uuidv4()
          this.nick = nick;	
          this.name = name;	
          this.email = email;	
          this.password	= password;
          this.address = address;
          this.lat=lat;	
          this.lon=lon;	
          this.bornDate	= date;	
          this.photo =	photo;	
          this.rating = rating;

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