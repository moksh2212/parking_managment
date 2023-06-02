import { useState, useEffect,useRef } from "react";
import { Car } from "../../components/Car";
import QRCode from "qrcode.react";
import emailjs from '@emailjs/browser';
import styles from "./main.module.scss";
import { ParkingSlot } from "../../components/ParkingSlot";
import { Controls } from "../../components/Controls";
import ParkingLot from "../../lib/parking-lot";
import { InfoBoard } from "../../components/InfoBoard/InfoBoard";
import Chatbot from "react-simple-chatbot";
import { ThemeProvider } from 'styled-components';

const ROW_LIMIT = 5;

export const Main = ({ slotsCount }) => {
  const [parkingLot, setParkingLot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState(slotsCount);
  const [rows, setRows] = useState([]);
  const [carAnimation, setCarAnimation] = useState(true);
  const [infoBoardVisible, setInfoBoardVisible] = useState(false);
  const [amount,setamount]= useState(0);
   const [id,setcarid]= useState("your car");
   const [previd,newid]=useState("XXXX");
   const [index,setindex]=useState(0);
   const[chec,setcheck]=useState(false);
  useEffect(() => {
    setParkingLot(new ParkingLot(slotsCount));
  }, [slotsCount]);

  useEffect(() => {
    function distributeSlotsToRows() {
      let rowsCount = Math.ceil(slotsCount / ROW_LIMIT);
      const rows = [];
      let row = [];

      while (slotsCount > 0 && rowsCount > 0) {
        // It's important first to decrement the count of the slots otherwise we will miss one
        slotsCount--;

        const slot = parkingLot?.slots[slotsCount];  //id
       

        const isSlotTaken = slot !== null && slot !== undefined;
        row.push({
          slotNum: slotsCount,
          isBusy: isSlotTaken,
          numberPlate: slot, 
          
        });

        if (slotsCount % ROW_LIMIT === 0) {
          rowsCount--;
          rows.push(row);
          row = [];
        }
      }

      setRows(rows);
    }

    distributeSlotsToRows();
  }, [slotsCount, availableSlots]);
  const onCarPark =(data)=>{
    fetch('https://parking-a579b-default-rtdb.firebaseio.com/carParked.json',{
      method:'POST',
      body:JSON.stringify({
        ParkingData:data
      })
    });
  };
  const onCarleaving =(data)=>{
    fetch('https://parking-a579b-default-rtdb.firebaseio.com/carleaving.json',{
      method:'POST',
      body:JSON.stringify({
        ParkingleavingData:data
      })
    });
  };
  const checkbox = useRef();

const handleClick = () => {
  if (checkbox.current.checked) {
    setcheck(true);
  }
} 
  const handleAddToParking = (carId) => {
    
    if (parkingLot.isFull()) {
      setInfoBoardVisible(true);
      return;
    }
    newid(carId);
    setindex(parkingLot.getindex()+1);
    var today = new Date();
    var current_time=today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var b = current_time.split(':'); 
    var seconds = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]); 
     console.log("entering time="+seconds);
     
    parkingLot.park(carId,seconds);
    setAvailableSlots(parkingLot.getAvailable());
    setCarAnimation((state) => !state);
    onCarPark({entering_Time:current_time, car_id:carId,position:index})
  };

  const handleRemoveFromParking = (carId) => {
    if (carId) {
      parkingLot.remove(carId);
      setamount(parkingLot.getbill());
      setcarid(parkingLot.getid());
      setAvailableSlots(parkingLot.getAvailable());
      setCarAnimation((state) => !state);
      var today = new Date();
      var current_time=today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      onCarleaving({leaving_Time:current_time, car_id:carId,amount:amount});
    }
  };

  const handleGetInfo = () => {
    setInfoBoardVisible((state) => !state);
  };
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_6nm4cld', 'template_nlqdh6t', form.current, 'EDW_3datZVjw80tfh')
      .then((result) => {                
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
      e.target.reset();
  };
 
// Creating our own theme
const theme = {
  background: 'rgb(220 201 20)',
   headerBgColor: 'rgb(46 45 38);',
   headerFontSize: '20px',
   botBubbleColor: 'rgb(108 119 12)',
   headerFontColor: 'white',
   botFontColor: 'white',
   userBubbleColor: '#dff906',
   userFontColor: 'white',
   
 };
 
 
 const config = {
   floating: true,
   height: '40rem',
   
 };
 
 const steps = [
  {
      id: '0',
      message: 'Hello',

      // This calls the next id
      // i.e. id 1 in this case
      trigger: '1',
  }, {
      id: '1',

      // This message appears in
      // the bot chat bubble
      message: 'Please write your issue',
      trigger: '2'
  }, {
      id: '2',

      // Here we want the user
      // to enter input
      user: true,
      trigger: '3',
  }, {
      id: '3',
      message: " how can I help you?",
      trigger: 4
  }, {
      id: '4',
      options: [
           
          // When we need to show a number of
          // options to choose we create alist
          // like this
          { value: 1, label: 'web issue', trigger:5 },
          { value: 2, label: 'Parking related issue',trigger:6 },

      ],
      
  }, {
    id: '5',
    message: "contact 91XXXXXXX for any query",
   
    end: true
}, {
  id: '6',
  message: "mail your parking related issue a xyz@gmail.com",
  trigger: 4,
  end: true
}

];


  return (
    <>
      <section className={styles.main}>
        {rows.map((row, idx) => (
          <div key={row + idx} className={styles.row}>
            {row.map(({ slotNum, isBusy, numberPlate }) => (
              <ParkingSlot
                remove={handleRemoveFromParking}
                key={slotNum + idx}
                num={slotNum}
                isBusy={isBusy}
                numberPlate={numberPlate}
              />
            ))}
          </div>
        ))}
      </section>
      <section className={styles.dashboard}>
      <nav className={styles.topnav}>
           <h1 className={styles.text}>PARKING LOT MANAGER</h1>
      </nav>
        <InfoBoard availableSlotsCount={availableSlots} getamount={amount} getSlotCount={slotsCount}  />
        <Controls add={handleAddToParking} getInfo={handleGetInfo} />
        <Car animationState={carAnimation} />
        <h1 className={styles.h}>Live Parking Lot View</h1>
        <form ref={form} onSubmit={sendEmail}>
          <label>Enter the email</label>
          <input type="email" name="user_mail"/>
          <label>Enter the name</label>
          <input type="text" name="user_name"/>
          <label>Slot number</label>
          <input type="number" name="user_index" value={index}/>
          <label>Unique Id</label>
          <input type="text" value={previd} name="park_id"/>
          <label>Any preganent woman in the car? <input type="checkbox" name="dish1"  ></input></label>
          <label>Any handicapped or disabled in the car ? <input type="checkbox" name="dish1" ></input></label>
        <input  type="submit" value="Send" />
        </form>
       
        <div className={styles.footerNote}>
          Click on a busy parking slot to unpark the car.
        </div>
        <div className={styles.color}>Car parking charges 50₹ per hour </div>
         <div className={styles.bill}><span className={styles.color}>Bill Amount for <span>{id}</span></span> : <span>{amount} ₹</span></div>
         <label>Check the payment successful status</label>
         <QRCode className={styles.q}
               value="https://effulgent-torte-6b5a33.netlify.app/"style={{ marginRight: 50 }}/> 
                  <label>Check the payment Unsuccessful status</label>
         <QRCode className={styles.q}
               value="https://zingy-sable-36314d.netlify.app/"style={{ marginRight: 50 }}/> 
        
        
      </section>
      <div>
      <ThemeProvider theme={theme}>
                <Chatbot
                    headerTitle="HelpBot"
                    steps={steps}
                    {...config}
 
                />
            </ThemeProvider>
            
            </div>
          
            <footer className={styles.footer}>
    <p class={styles.copyright}>© Moksh Avinav Sarthak</p>
</footer>
    </>
  );
};
