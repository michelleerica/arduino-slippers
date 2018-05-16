let circles = [];
let velocityScale = 1

var setup = function () {

    createCanvas(windowWidth, windowHeight); // window.innerWidth
    background(0); // black background; could also use RGB: background(0, 0, 0);

    colorMode(HSB, 255); // Use Hue Saturation Brightness, with a range of 0-255 for each

    // noStroke(); // Don't draw a border on shapes

    // Only draws once:
    // fill(255, 0, 0);
    // x and y position, width and height
    // ellipse( windowWidth/2, windowHeight/2, 80, 80 );

    // textSize(24);  // If you want to use text()
    // blendMode(LIGHTEST);
};

var draw = function () {
    // ellipse(windowWidth/2, windowHeight/2, 80,80);
    // rect(mouseX, mouseY, 80,80);

    // text("woot", mouseX, mouseY);
    // fill(250, 150,150);

    // if(keyIsDown(SHIFT) || mouseIsPressed){
    //     var hue = map(mouseX, 0, windowWidth, 0, 255);
    //     ellipse(mouseX, mouseY, 50, 50);
    //     stroke(hue, 255, 255);
    //     line(mouseX, mouseY, mouseX - random(-200, 200), mouseY + random(-200, 200) )
    // }

    // if (keyIsDown(SHIFT) || mouseIsPressed){
    //     var height = random(50, 50);
    //     var width = random(50, 50);

    //     triangle(
    //       mouseX, mouseY,  // top
    //       mouseX - width, mouseY + height, // bottom left
    //       mouseX + width, mouseY + height  // bottom right
    //     );

    //     var size = random(50, 50);

    //     ellipse(random(windowWidth), random(windowHeight), size, size);
        
    // }
    // if (keyIsDown(SHIFT) || mouseIsPressed){
    
        // if (keyIsDown(SHIFT) || mouseIsPressed){
    if (keyIsDown(SHIFT) || mouseIsPressed){
        var hue = map(mouseX, 0, windowWidth, 0, 255);

        var circle = {
            velocityX: random(-10, 10),
            velocityY: random(-10, 10),
            x: mouseX,
            y: mouseY,
            hue: hue,
            bright: 255
        };

        circles.push(circle);
    }

    for(let i=0; i<circles.length; i++){
        var c = circles[i];
        c.x += c.velocityX * velocityScale;
        c.y += c.velocityY * velocityScale;

        if (c.x >= windowWidth || c.x <= 0) {
            c.velocityX *= -1;
        }
        if (c.y >= windowHeight || c.y <= 0) {
            c.velocityY *= -1;
        }

        fill(c.hue, 255, c.bright);
        ellipse(
            c.x,
            c.y,
            50,
            50
        );

    } //for


}