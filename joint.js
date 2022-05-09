class Joint{
    constructor(gateid, x, y, input, id, sop){
        this.gateid = gateid;
        this.x = x;
        this.y = y;
        this.input = input;
        this.id = id;
        this.connectedids = [];
        this.value = 0;
        this.locked = false;
        this.hover = false;
        this.sop = sop;
    }
    addConnection(newid){
        this.connectedid.push(newid);
    }
    removeConnection(removeid){
        this.connectedid.splice(this.connectedid.findIndex(removeid), 1);
    }
}