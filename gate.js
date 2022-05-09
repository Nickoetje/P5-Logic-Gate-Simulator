class Gate {
    constructor(name, id, type, x, y) {
        if (name != "") {
            this.name = name;
        } else {
            this.name = types[type][2];
        }
        this.id = id;  //random id of gate
        this.type = type; //type of gate
        this.x = x;
        this.y = y;
        this.width = 50;
        this.lenght = 50;
        this.locked = false;
        this.offsetx = 0;
        this.offsety = 0;
        this.selected = false;
        this.joints = [];
        //calculate inputs/outputs based on type
        this.inputs = types[this.type][0];
        this.outputs = types[this.type][1];
        //create each joint based on inputs/outputs amount
        for (let i = 1; i <= this.inputs; i++) {
            this.joints.push(new Joint(this.id, this.x, this.y, true, this.newJointId(), ""));
        }
        for (let i = 1; i <= this.outputs; i++) {
            this.joints.push(new Joint(this.id, this.x, this.y, false, this.newJointId(), types[type][2 + i]));
        }
    }
    draw(gates) {
        //draw gate
        switch (this.type) {
            case 1://and
                fill(0);
                if (!this.locked) {
                    stroke(0, 0);
                } else {
                    stroke(0, 0, 255);
                }
                if(this.selected){
                    stroke(254, 140, 0);
                }
                image(and, this.x, this.y);
                noFill();
                rect(this.x, this.y, this.width, this.lenght);
                break;
            case 2://not
                fill(0);
                if (!this.locked) {
                    stroke(0, 0);
                } else {
                    stroke(0, 0, 255);
                }
                if(this.selected){
                    stroke(254, 140, 0);
                }
                image(not, this.x, this.y);
                noFill();
                rect(this.x, this.y, this.width, this.lenght);
                break;
            case 3://or
                fill(0);
                if (!this.locked) {
                    stroke(0, 0);
                } else {
                    stroke(0, 0, 255);
                }
                if(this.selected){
                    stroke(254, 140, 0);
                }
                image(or, this.x, this.y);
                noFill();
                rect(this.x, this.y, this.width, this.lenght);
                break;
            case 4://input switch
                fill(0);
                stroke(0, 0);
                if (!this.locked) {
                    if (this.name != 'n') {
                        if (this.joints[0].value) {
                            //is turned on
                            image(on, this.x, this.y);
                        } else {
                            image(off, this.x, this.y);
                        }
                    } else {
                        image(off, this.x, this.y);
                    }
                } else {
                    if (this.joints[0].value) {
                        //is turned on
                        image(on, this.x, this.y);
                    } else {
                        image(off, this.x, this.y);
                    }
                }
                if(this.selected){
                    stroke(254, 140, 0);
                }
                noFill();
                rect(this.x, this.y, this.width, this.lenght);
                break;
            case 5://output lamp
                fill(0);
                stroke(0, 0);
                if (!this.locked) {
                    if (this.name != 'n') {
                        if (this.joints[0].value) {
                            //is turned on
                            image(lon, this.x, this.y);
                        } else {
                            image(loff, this.x, this.y);
                        }
                    } else {
                        image(loff, this.x, this.y);
                    }
                } else {
                    if (this.joints[0].value) {
                        //is turned on
                        image(lon, this.x, this.y);
                    } else {
                        image(loff, this.x, this.y);
                    }
                }
                if(this.selected){
                    stroke(254, 140, 0);
                }
                noFill();
                rect(this.x, this.y, this.width, this.lenght);
                break;
            case 6://xor
                fill(0);
                if (!this.locked) {
                    stroke(0, 0);
                } else {
                    stroke(0, 0, 255);
                }
                if(this.selected){
                    stroke(254, 140, 0);
                }
                image(xor, this.x, this.y);
                noFill();
                rect(this.x, this.y, this.width, this.lenght);
                break;
            case 7://nand
                fill(0);
                if (!this.locked) {
                    stroke(0, 0);
                } else {
                    stroke(0, 0, 255);
                }
                if(this.selected){
                    stroke(254, 140, 0);
                }
                image(nand, this.x, this.y);
                noFill();
                rect(this.x, this.y, this.width, this.lenght);
                break;
            case 8://nor
                fill(0);
                if (!this.locked) {
                    stroke(0, 0);
                } else {
                    stroke(0, 0, 255);
                }
                if(this.selected){
                    stroke(254, 140, 0);
                }
                image(nor, this.x, this.y);
                noFill();
                rect(this.x, this.y, this.width, this.lenght);
                break;
            default://custom gate draw box
                //write name in gate unless hud
                if (this.name != 'n') {
                    textSize(15);
                    stroke(255);
                    fill(0);
                    text(this.name, this.x, this.y + this.lenght / 2 + 6);
                }
                fill(0, 0);
                if (!this.locked) {
                    stroke(0);
                } else {
                    stroke(0, 0, 255);
                }
                if(this.selected){
                    stroke(254, 140, 0);
                }
                rect(this.x, this.y, this.width, this.lenght);
                break;
        }

        //draw joints for gate
        this.joints.forEach(joint => {
            fill(0);
            stroke(0);
            if (joint.input) {
                joint.x = this.x - 20;
                if (this.inputs > 1 ? joint.y = this.y + (this.lenght + 16) / (this.inputs + 1) * joint.id - 8 : joint.y = this.y + this.lenght / 2);
                line(joint.x, joint.y, this.x, joint.y);

            } else {
                joint.x = this.x + this.width + 20;
                if (this.outputs > 1 ? joint.y = this.y + (this.lenght + 16) / (this.outputs + 1) * (joint.id - this.inputs) - 8 : joint.y = this.y + this.lenght / 2);
                line(joint.x, joint.y, this.x + this.width, joint.y);

            }
            if (joint.hover) {
                fill(120);
                stroke(255);
                joint.hover = false;
            } else {
                //check value of joint
                if (joint.value) {
                    fill(0, 255, 0);
                } else {
                    fill(255, 0, 0);
                }
                stroke(255);
            }
            ellipse(joint.x, joint.y, 12);

            //draw connected lines from output to input
            if (joint.connectedids.length > 0 && !joint.input) {
                joint.connectedids.forEach(endplace => {
                    let endgate = gates[gates.findIndex(x => x.id === endplace[0])];
                    let endjoint = endgate.joints[endgate.joints.findIndex(x => x.id === endplace[1])];
                    //draw line
                    stroke(0);
                    fill(0);
                    line(joint.x, joint.y, endjoint.x, endjoint.y);
                });
            }
        });
    }
    calculate(gates) {
        //run simulation
        this.joints.forEach(joint => {
            //set inputs according to outputs
            if (joint.input) {
                //if joint is input check all connection for high value
                for (let i = 0; i < joint.connectedids.length; i++) {
                    try{
                        let connection = [joint.connectedids[i][0], joint.connectedids[i][1]];
                        gate2 = gates[gates.findIndex(x => x.id === connection[0])];
                        joint2 = gate2.joints[gate2.joints.findIndex(x => x.id === connection[1])];
                        if (joint2.value) {
                            joint.value = 1;
                            break;
                        }

                        //check if the value is still one and on last check
                        if (joint.value && i == joint.connectedids.length - 1) {
                            joint.value = 0;
                        }
                    }catch{
                        gates.joints = [];
                    }
                    
                }
                //if nothing is connected turn back to 0
                if (joint.connectedids.length == 0) {
                    joint.value = 0;
                }
            }
            //do boolean SOP gate calcuation for output !!TODO simulate open gates!! 
            if (!joint.input && this.type != 4) {
                let jointvalues = [];
                for (let i = 0; i < this.inputs; i++) {
                    jointvalues.push(this.joints[i].value)
                }
                let invertedB = false;
                let sum = joint.sop.split('+');
                let sumcount = [];
                sum.forEach(bool => {
                    let inverted = 0;
                    let temp = [];
                    for (let i = 0; i < bool.length; i++) {
                        let letter = bool[i];
                        if (letter != '!') {
                            let index = indexPosition(letter);
                            temp.push(jointvalues[index]);
                        } else {
                            inverted++;
                            let next = bool[i + 1];
                            let index = indexPosition(next);
                            temp.push(1 - jointvalues[index]);
                            i++;
                        }
                    }
                    let count = 0;
                    if (inverted == jointvalues.length && sum.length == 1) {
                        invertedB = true;
                        for (let i = 0; i < temp.length; i++) {
                            if (temp[i] == 1) {
                                sumcount.push(1);
                            }
                        }
                    } else {
                        for (let i = 0; i < temp.length; i++) {
                            if (temp[i] == 1) {
                                count++;
                            }
                        }
                        (count == temp.length) ? sumcount.push(1) : sumcount.push(0);
                    }

                });
                let count = 0;
                if (!invertedB) {
                    for (let i = 0; i < sumcount.length; i++) {
                        if (sumcount[i] == 1) {
                            count = 1;
                        }
                    }
                    (count) ? joint.value = 1 : joint.value = 0;
                } else {
                    for (let i = 0; i < sumcount.length; i++) {
                        if (sumcount[i] == 1) {
                            count += 1;
                        }
                    }
                    (count) ? joint.value = 1 : joint.value = 0;
                }

            }
        });

    }
    newJointId() {
        let id = 1;
        while (this.joints[this.joints.findIndex(x => x.id === id)]) {
            id++;
        }
        return id;
    }
}
function indexPosition(letter) {
    var result = "";
    var code = letter.toUpperCase().charCodeAt(0);
    if (code > 64 && code < 91) result = (code - 65);
    return result;
}