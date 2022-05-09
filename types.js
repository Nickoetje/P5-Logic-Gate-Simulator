//TYPES OF GATES TODO: ADD A NEGATIVE INVERTION FOR NAND AND NOR
types = { //used so that we can make custom gates
    //id: [inputs, outputs, name, (string; if more then 1 output sop seperated by comma like: "sop", "sop")] NOTE!! SOP no spaces!!
    1: [2, 1, "AND", "AB"],
    2: [1, 1, "NOT","!A"],
    3: [2, 1, "OR","A+B"],
    4: [0, 1, "SWITCH","A"],
    5: [1, 0, "LIGHT","A"],
    6: [2, 1, "XOR","!AB+A!B"],
    7: [2, 1, "NAND","!A!B"],
    8: [2, 1, "NOR", "!A!B+!A!B"]
}