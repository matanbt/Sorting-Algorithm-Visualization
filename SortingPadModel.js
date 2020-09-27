import {helpers,sortingAlgoVis} from "./sortingAlgo.js";

export const round = (num) => Math.round(num * 10) / 10


//Class for a canvas Bar object (represents an array element)
export class Bar {
    static status_options = {
        inactive: 'inactive',
        candidate: 'candidate',
        active: 'active',
        sorted: 'sorted',
        group_active:'group_active',
    }

    static status_colors = {
        inactive: 'grey',
        candidate: 'orange',
        active: 'blue',
        sorted: 'green',
        group_active:'#0099ff',
    }

    constructor(pad, loc, value) {
        this.pad = pad //bounds bar to Pad instance
        this.loc = loc;
        this.value = value;
        this.status = Bar.status_options.inactive;
    }

    getX() {
        return round(this.loc * this.pad.bar_width)
    }

    clearBar() {
        //clear THIS bar in the given pad
        //this.pad.canvas.clearRect(this.getX(),0,this.pad.bar_width,this.pad.height);
        this.pad.canvas.clearRect(this.getX() - this.pad.bar_margin, 0,
            this.pad.bar_width + this.pad.bar_margin, this.pad.height);
    }

    drawBar() {
        let bar_height = this.value * this.pad.height;

        //draws THIS bar in the given pad, assumes clear was called before
        //color by status
        this.pad.canvas.fillStyle = Bar.status_colors[this.status];
        this.pad.canvas.fillRect(this.getX(), this.pad.height - bar_height,
            this.pad.bar_content_width, bar_height);
    }

    changeLoc(newLoc) {
        //will clean itself and change its loc
        //RE DRAW NEEDED! after clearing the new Loc Bar (will be done in the Pad class)
        this.clearBar();
        this.loc = newLoc;
    }

    setStatus(status) {
        if (status !== this.status) {
            this.status = status;
            this.clearBar();
            this.drawBar();
        }
    }

}

//Class for the main canvas, which shows the sorting procedure
export class SortPad {
    /*
        height & width - defines the canvas
        orig_arr - original array that is being mutated - for readonly purposes
        bars_arr - array of Bar objects, analog to the original array
        canvas - the canvas object that used for drawing

        invariant : orig_arr AND bars_arr has the same values.

     */


    //given array with numbers between 0.0 to 1.0,
    //allows creating canvas to simulate array manipultaions
    constructor(width, height) {
        this.height = height;
        this.width = width;

        this.elem = document.createElement('canvas');
        this.elem.height = this.height;
        this.elem.width = this.width;
        this.canvas = this.elem.getContext('2d');
        document.body.append(this.elem);

    }

    init(len) {
        if (this.isRunning) return;

        //can be called without length only when array was initialized before
        if (!len)
            len = this.length;
        this.orig_arr = helpers.makeRandomArray(len);
        this.length = len;


        //CALCULATE SIZES:
        this.bar_width = round(this.width / this.orig_arr.length);
        this.margin_ratio = 0.2;
        this.bar_margin = round(this.bar_width * this.margin_ratio)
        this.bar_content_width = this.bar_width - this.bar_margin;
        this.width = this.bar_width * this.orig_arr.length; //normalize width

        //CLEAR CANVAS:
        this.canvas.clearRect(0, 0, this.width, this.height);

        //UPDATE CANVAS:
        this.elem.width = this.width;

        //CREATE BARS ARR:
        this.bars_arr = [];
        for (let i = 0; i < this.orig_arr.length; i++) {
            this.bars_arr.push(new Bar(this, i, this.orig_arr[i]))
        }

        //LOAD ALL BARS
        for (let bar of this.bars_arr) {
            bar.clearBar();
            bar.drawBar();
        }
    }

    switchBetween(loc_1, loc_2) {
        //called when changed has been made in the original array; changes bar_array
        console.log(this.bars_arr[loc_1]);
        this.bars_arr[loc_1].changeLoc(loc_2);
        this.bars_arr[loc_2].changeLoc(loc_1);
        [this.bars_arr[loc_1], this.bars_arr[loc_2]] = [this.bars_arr[loc_2], this.bars_arr[loc_1]]

        this.bars_arr[loc_1].drawBar();
        this.bars_arr[loc_2].drawBar();
    }

    updateStatus(loc, status) {
        this.bars_arr[loc].setStatus(status);
    }

    updateStatusOfRange(loc_l,loc_r,status){
        for (let loc=loc_l;loc<=loc_r;loc++){
            this.updateStatus(loc,status);
        }
    }

    updateStatusOfAll(status){
        this.updateStatusOfRange(0,this.bars_arr.length-1,status);
    }

    setSorted() {
        for (let bar of this.bars_arr) {
            bar.setStatus(Bar.status_options.sorted);
        }
        this.canvas.font = "70px Comic Sans MS";
        this.canvas.fillStyle = 'blue';
        this.canvas.textAlign = "start";
        this.canvas.textBaseline = 'hanging';
        this.canvas.fillText('Sorted!', 0, 0)
    }

    toggleRun() {
        this.isRunning = !this.isRunning;
    }

}
