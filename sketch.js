//TODO: save state to cookies/file, selection copy paste

//preload images
function preload() {
    and = loadImage('assets/and.png');
    not = loadImage('assets/not.png');
    or = loadImage('assets/or.png');
    xor = loadImage('assets/xor.png');
    nand = loadImage('assets/nand.png');
    nor = loadImage('assets/nor.png');
    on = loadImage('assets/on.png');
    off = loadImage('assets/off.png');
    lon = loadImage('assets/lon.png');
    loff = loadImage('assets/loff.png');
}

function setup() {
    createCanvas(displayWidth, displayHeight);
    gates = [];
    draggingjoint = [];
    lastclickid = [0, 0];
    //selection
    lastpos = [0, 0];
    dragging = false;
    selection = [];

    //nav pos
    hudx = 10;
    hudy = 10;
    hudw = 120;
    hudl = 900;

    //nav gates to spawn
    let navy = 50;
    for (let i = 1; i <= Object.keys(types).length; i++) {
        gate = new Gate("n", i, i, hudx + hudw / 2 - 25, hudy + navy);
        gates.push(gate);
        navy += 100;
    }

    //DEBUGIN BUTTON
    // button = createButton('Debug gates to console');
    // button.position(0, 0);
    // button.mousePressed(showgates);

}

function draw() {
    background(0);
    stroke(255);
    //hud
    //outside box
    fill(120, 140, 40);
    rect(hudx, hudy, hudw, hudl);


    //work space
    fill(255);
    rect(10 + 130, 10, 1200, 900);

    //check invalid placed
    let invalidHudGates = [];
    gates.forEach(gate => {
        if (gate.name != 'n') {
            gatex = gate.x;
            gatey = gate.y;
            gatew = gate.width;
            gatel = gate.lenght;
            if (
                gatex + 50 > hudx &&
                gatex < hudx + hudw &&
                gatey + 50 > hudy &&
                gatey < hudy + hudl &&
                gate.locked == false
            ) {
                invalidHudGates.push(gate.id);
            }
        }
    });

    //remove invalid gates
    invalidHudGates.forEach(id => {
        removeInvalidGate(id, gates);
    })

    //draw and calculate gates
    gates.forEach(gate => {
        gate.draw(gates);
        if (gate.name != 'n') {
            gate.calculate(gates);
        }
    });


    //hover over joints
    hovering = overjoint(1);
    if (hovering[0]) {
        gate = gates[gates.findIndex(x => x.id === hovering[0])];
        if (gate.name != 'n') {
            joint = gate.joints[gate.joints.findIndex(x => x.id === hovering[1])];
            joint.hover = true;
        }
    }

    //draw lines when connecting gates
    if (draggingjoint[0]) {
        //draw line from selected joint to mouse
        stroke(0);
        fill(0);
        gate = gates[gates.findIndex(x => x.id === draggingjoint[0])];
        joint = gate.joints[gate.joints.findIndex(x => x.id === draggingjoint[1])];
        line(joint.x, joint.y, mouseX, mouseY);

        //check if mouse is above other joint and if so highlight it
        hover = overjoint(1);
        if (hover[0] != 0 && hover[0] != draggingjoint[0] && hover[1] != draggingjoint[1]) {
            hgate = gates[gates.findIndex(x => x.id === hover[0])];
            hjoint = gate.joints[gate.joints.findIndex(x => x.id === hover[1])];

        }
    }

    //draw selection box
    if (dragging) {
        noFill();
        stroke(0);
        rect(lastpos[0], lastpos[1], mouseX - lastpos[0], mouseY - lastpos[1]);
        selectedGates([lastpos[0], lastpos[1], mouseX, mouseY], gates);
    }

}
function keyPressed() {
    if (keyCode === DELETE) {
        let invalidGates = [];
        gates.forEach(gate => {
            if(gate.selected){
                invalidGates.push(gate.id);
            }
        });
        invalidGates.forEach(inval => {
            removeInvalidGate(inval, gates);
        });
    } 
}

function mousePressed() {
    dragging = false;
    //dragging box
    box = overbox();
    if (box) {
        gate = gates[gates.findIndex(x => x.id === box)];
        if (gate.name != "n") {
            //normal gate drag it TODO check for selected gates
            gates.forEach(gate => {
                if(gate.selected){
                    gate.xoffset = mouseX - gate.x;
                    gate.yoffset = mouseY - gate.y;
                }
            });
            gate.locked = true;
            gate.xoffset = mouseX - gate.x;
            gate.yoffset = mouseY - gate.y;
        } else {
            //user clicked on hub creating new gate
            gates.forEach(gate => {
                if(gate.selected){
                    gate.locked = false;
                    gate.selected = false;
                }
            });
            newid = newId();
            temp = new Gate("", newid, gate.type, gate.x, gate.y);
            temp.locked = true;
            gate.locked = false;
            temp.xoffset = mouseX - gate.x;
            temp.yoffset = mouseY - gate.y;
            gates.push(temp);
        }
        return;
    }
    //dragging jointline
    joint = overjoint(0);
    if (joint[0]) {
        gates.forEach(gate => {
            gate.selected = false;
            gate.locked = false;
        });
        gateid = joint[0];
        jointid = joint[1];
        gate = gates[gates.findIndex(x => x.id === gateid)];
        if (gate.name != "n") {
            //normal joint drag it
            joint = gate.joints[gate.joints.findIndex(x => x.id === jointid)];
            joint.locked = true;
            dragging = false;
            draggingjoint = [gate.id, joint.id];
        }
        return;
    }
    gates.forEach(gate => {
        gate.locked = false;
        gate.selected = false;
    });
    lastpos = [mouseX, mouseY];
    lastclickid = [0, 0];
}

function mouseMoved() {
    lastclickid = [0, 0];
}

function mouseDragged() {
    lastclickid = [0, 0];
    dragging = true;
    gates.forEach(gate => {
        if (gate.locked) {
            dragging = false;
            if (gate.xoffset) {
                gate.x = mouseX - gate.xoffset;
                gate.y = mouseY - gate.yoffset;
            } else {
                gate.x = mouseX;
                gate.y = mouseY;
            }
        }
        gate.joints.forEach(joint => {
            if (joint.locked) {
                dragging = false;
            }
        });
    });
    if (dragging) {
        selection = [lastpos[0], lastpos[1], mouseX, mouseY];
    }

}

function mouseReleased() {
    //if dragging
    if (dragging) {
        selection = [lastpos[0], lastpos[1], mouseX, mouseY];
    }
    dragging = false;

    //TODO update joints value to 0 when disconnected
    if (draggingjoint[0]) {
        hover = overjoint(1);
        //check if not connecting to self
        if (hover[0] != 0 && draggingjoint[0] != hover[0]) {
            //releasing line above new connection create connection
            gate1 = gates[gates.findIndex(x => x.id === draggingjoint[0])];
            joint1 = gate1.joints[gate1.joints.findIndex(x => x.id === draggingjoint[1])];
            gate2 = gates[gates.findIndex(x => x.id === hover[0])];
            joint2 = gate2.joints[gate2.joints.findIndex(x => x.id === hover[1])];

            //check if input to output or vise versa
            if (!joint1.input && joint2.input || joint1.input && !joint2.input) {
                //push connection to both joints
                joint2.connectedids.push([gate1.id, joint1.id]);
                joint1.connectedids.push([gate2.id, joint2.id]);
            }

        }
    }
    draggingjoint = [0, 0];
    gates.forEach(gate => {
        gate.locked = false;
        if(gate.selected){
            gate.locked = true;
        }
        gate.joints.forEach(joint => {
            joint.locked = false;
        });
    });
}

function overbox() {
    exit = 0;
    gates.forEach(gate => {
        gatex = gate.x;
        gatey = gate.y;
        gatew = gate.width;
        gatel = gate.lenght;
        if (
            mouseX > gatex &&
            mouseX < gatex + gatew &&
            mouseY > gatey &&
            mouseY < gatey + gatel
        ) {
            if (!gate.locked) {
                //clicked
                if (lastclickid[0] == gate.id) {
                    //double clicked box
                    if (gate.type == 4 && gate.name != 'n') {
                        //switch gate
                        //reverse value
                        gate.joints[0].value = !gate.joints[0].value;
                    }

                    lastclickid = [0, 0];
                } else {
                    lastclickid = [gate.id, 0];
                }
            }
            exit = gate.id;
        }
    });
    return exit;
}

function overjoint(hovering) {
    exit = [0, 0];
    gates.forEach(gate => {
        gate.joints.forEach(joint => {
            jointx = joint.x - 6;
            jointy = joint.y - 6;
            jointw = 12;
            jointl = 12;
            if (
                mouseX > jointx &&
                mouseX < jointx + jointw &&
                mouseY > jointy &&
                mouseY < jointy + jointl
            ) {
                if (!joint.locked && !hovering) {
                    //clicked
                    if (lastclickid[0] == gate.id && lastclickid[1] == joint.id) {
                        //double clicked joint
                        //remove all conected lines from other joint
                        gates.forEach(gate => {
                            gate.joints.forEach(joint => {
                                for (let i = 0; i < joint.connectedids.length; i++) {
                                    let connection = [joint.connectedids[i][0], joint.connectedids[i][1]];
                                    if (connection[0] == lastclickid[0] && connection[1] == lastclickid[1]) {
                                        joint.connectedids.splice(i, 1);
                                    }
                                }
                            });
                        });
                        //remove joint connection from own joint
                        joint.connectedids = [];
                        //set joint value to 0
                        joint.value = 0;

                        lastclickid = [0, 0];
                    } else {
                        lastclickid = [gate.id, joint.id];
                    }
                }
                exit = [gate.id, joint.id];
            }
        });
    });
    return exit;
}

function selectedGates(selection, gates) {
    //selection[pos1, pos2, mouseX, mouseY]
    let temp = 0;
    if(selection[0] > selection[2]){
        temp = selection[0];
        selection[0] = selection[2];
        selection[2] = temp;
    }
    if(selection[1] > selection[3]){
        temp = selection[1];
        selection[1] = selection[3];
        selection[3] = temp;
    }

    gates.forEach(gate => {
        gatex = gate.x;
        gatey = gate.y;
        gatew = gate.width;
        gatel = gate.lenght;
        if (
            gatex + 50 > selection[0] &&
            gatex < selection[2] &&
            gatey + 50 > selection[1] &&
            gatey < selection[3] && 
            gate.name != 'n'
        ) {
            gate.selected = true;
        }else{
            gate.selected = false;
        }
    });
}

function removeInvalidGate(gateid, gates) {
    //get list of all invalid ids
    let invalidids = [];

    gates[gates.findIndex(x => x.id === gateid)].joints.forEach(joint => {
        invalidids.push([gate.id, joint.id]);
    });
    //remove all where [gate, id]
    invalidids.forEach(invalid => {
        gates.forEach(gate => {
            gate.joints.forEach(joint => {
                for (let i = 0; i < joint.connectedids.length; i++) {
                    connection = [joint.connectedids[i][0], joint.connectedids[i][1]];
                    if (connection[0] == invalid[0] && connection[1] == invalid[1]) {
                        joint.connectedids.splice(i, 1);
                    }
                }
            });
        });
    });
    gates.splice(gates.findIndex(x => x.id === gateid), 1);
}

//extra functions
function showgates() {
    gates.forEach(e => {
        console.log(e);
    });
}

function newId() {
    id = 4;
    while (gates[gates.findIndex(x => x.id === id)]) {
        id++;
    }
    return id;
}