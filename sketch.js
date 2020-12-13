var dog,happyDog;
var database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var dogImage;
var happyDogImage;
var food1

function preload()
{
  happyDogImage = loadImage("images/Dog.png");
  dogImage = loadImage("images/happydog.png");
}

function setup() {
  createCanvas(1000, 400);
  dog = createSprite(750,300,20,20);
  dog.addImage(dogImage);
  dog.scale = 0.2;

  database = firebase.database();

  food1 = new Food();

  feed = createButton("Feed the Dog");
  feed.position(700,100);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(790,100);
  addFood.mousePressed(addFoods);

  foodStock = database.ref('food');
  foodStock.on("value",readStock);
}


function draw() {  
  background(46,139,87);
  food1.display();
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Fed: "+lastFed%12 + "PM",350,30);
  }
  else if(lastFed === 0){
    text("Last Fed: 12"+"AM",350,30);
  }
  else{
    text("Last Fed: "+lastFed + "AM",350,30);
  }


  drawSprites();
}

function readStock(data){
  foodS = data.val();
  food1.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImage);
  

  food1.updateFoodStock(food1.getFoodStock()-1);
  database.ref('/').update({
    Food:food1.getFoodStock(),
    FeedTime:hour()
  });
}

function writeStock(x){
  if(x<=0){
    x=0;
  } 
  else{
    x=x-1
  }

  database.ref('/').update({
    food:x
  })
}

function addFoods(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}
