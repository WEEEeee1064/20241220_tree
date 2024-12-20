// serial communication with a microcontroller sending multiple values
// arduino code can be found here : https://gist.github.com/shfitz/0aabb07daa8ef84904d6e3c6a17381a0

let serial; // variable for the serial object
let sensors = [255, 255, 0]; // array to hold data from arduino
let pX, pY;
let count =0
let W =500

function setup() {
  frameRate(30)
  createCanvas(W,W)
  pX = width / 2;
  pY = height / 2;
  background(0,0,0)

  // serial constructor
  serial = new p5.SerialPort();

  // serial port to use - you'll need to change this
  serial.open("COM6");

  // what to do when we get serial data
  serial.on("data", gotData);

  // when to do when the serial port opens
  serial.on("open", gotOpen);
}

function draw() {

  
  count +=0.5
  
  let cX = map(sensors[0], 0,1023,-W/2,W/2);
  let cY = map(sensors[1],0,1023,-W/2,W/2);

  // update the coordinates for the next pass through
  pX = cX;
  pY = cY;

     if(sensors[2] == 0){
      fill(255,50)
    }else{
      fill(10,20,15,49)
    }
	rect(0,0,W,W)
    

    let c1 = color(135, 227, 216); // 藍_淺
    let c2 = color(54, 126, 132); // 藍_深
    let c3 = color(221, 224, 181); //橘_淺
    let c4 = color(201, 144, 74); //橘_深

    if(sensors[2] == 0){
      stroke('black')
      tree(W/2,0,count,12,pX,pY)
    }else{
      for(let i=0;i<7;i++){
      
      let inter = map(i, 0, 7, 0, 1);
      let c = lerpColor(c1, c4, inter);
      
      stroke(c);
      tree_L(W/2,W/8*i,count,2+i,pX,pY)
    }
    for(let i=0;i<7;i++){
      let inter = map(i, 0, 7, 0, 1);
      let c = lerpColor(c3, c2, inter);
      
      stroke(c);
      tree_R(W/2,W/8*i,count,2+i,pX,pY)
    }
    
    }
  
    
    copy(10  ,10,W-20,W-20,0,0,W,W);
  
}

// what do you do when you recxeive data?
function gotData() {
  let currentString = serial.readStringUntil('\r\n'); // store the data in a variable
  trim(currentString); // get rid of whitespace
  if (currentString.length > 0 && currentString != 'hi'){
  sensors = split(currentString, ",");
  console.log(sensors);
  serial.write("A");
  }
}

function gotOpen() {
  console.log("Serial Port is Open");
  serial.clear(); // clears the buffer of any outstanding data
  serial.write("A"); // send a byte to the Arduino
}


function tree_L(x,y,count,step,cX,cY){
		if(step>0){
          
		  inf = (10-step)*0.02
          let n=noise(0.0268*count)*inf
          
            line(x, y, W/2,(y+W/4)-step*1.5) //n = noise*random
			
            step--
			tree_L(x-100*cos(n*5)+5*sin(n*5)+0.01*cX,y+20*sin(n)+cos(n*5)/PI+0.005*cY,count,step,cX,cY)
			tree_L(x+100*sin(n*5)+cos(n)*PI+0.01*cX,y+20*cos(n)+sin(n*5)/PI+0.005*cY,count,step,cX,cY)
		}
}

function tree_R(x,y,count,step,cX,cY){
		if(step>0){
          
		  inf = (10-step)*0.02
          let n=noise(0.0258*count)*inf
          
            line(x, y, W/2,(y+W/4)-step*1.5) //n = noise*random
			
            step--
			tree_R(x+100*cos(n*5)+sin(n*5)+0.01*cX,y+20*sin(n)+cos(n*5)/PI+0.005*cY,count,step,cX,cY)
			tree_R(x-100*sin(n*5)+cos(n)*PI+0.01*cX,y+20*cos(n)+5*sin(n*5)+0.005*cY,count,step,cX,cY)
		}
}

function tree(x,y,count,step,cX,cY){
		if(step>0){
          
			line(x, y, W/2,W-step*W/40*3) //n = noise*random
			
            step--
			tree(x-W/8+0.01*cY,y+W/20+0.01*cX,count,step,cX,cY)
			tree(x+W/8+0.01*cY,y+W/20+0.01*cX,count,step,cX,cY)
		}
}