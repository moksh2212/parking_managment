class ParkingLot {
  slots = [];
  time =[];
  bill=0;
  id="";
  index=-1;
  constructor(parkingSize) {
    this.slots = new Array(parkingSize).fill(null);
    this.time = new Array(parkingSize).fill(null);
  }

  park(carId,t1) {
    console.log(`Parking car: ${carId}`);
    console.log(`Parking car time in parking lot: ${t1}`);

    if (this.slots.every((slot) => slot !== null)) {
      return false;
    }
   
   
    for (let i = 0; i <= this.slots.length; i++) {
      const slot = this.slots[i];
       const t=this.time[i];
      if (slot === null) {
        this.slots[i] = carId;
        this.time[i] = t1;
        this.index=i;
        return true;
      }

    }
  }

  remove(carId) {
    console.log(`Leaving car: ${carId}`);
    var today2 = new Date();
    var t2=today2.getHours() + ":" + today2.getMinutes() + ":" + today2.getSeconds();
    var a = t2.split(':'); 
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    if (this.slots.every((slot) => slot !== carId)) {
      return false;
    }
  
    for (let i = 0; i <= this.slots.length; i++) {
      const slot = this.slots[i];

      if (slot === carId) {
        var t1=this.time[i];
        this.slots[i] = null;
        this.time[i]=null;
        this.bill=Math.abs((seconds-t1)*0.013);
        this.id=carId;
        
        console.log("removing time t2=",seconds);
        console.log(`total bill for  ${carId} is`,((seconds-t1)*0.013));
        return true;
      }
    }

  }
  getindex(){
    return this.index;
  }
  getbill() {
    return this.bill;
  }
  getid() {
    return this.id;
  }
  getSlots() {
    console.log(`Parking slots: ${this.slots}`);
    return this.slots;
  }

  getSize() {
    console.log(`Parking size is: ${this.slots.length}`);
    return this.slots.length;
  }

  getAvailable() {
    const availableSlots = this.slots.filter((s) => s === null).length;
    console.log(`Available parking slots: ${availableSlots}`);
    return availableSlots;
  }

  isFull() {
    return this.getAvailable() === 0;
  }
}

export default ParkingLot;
