import {setListeners} from "./setupUI.js";
import {round,SortPad} from "./SortingPadModel.js";


//application variables:
export const vars = {
    can_width: round(window.innerWidth * 0.9),
    can_height: round(window.innerHeight * 0.9 - 40),
    base_size_arr: 7,
    default_speed: 100,

    //vars that are changed through the script (by UI)
    speed: 100,
    algorithm: 'bubble',
    isRunning : false,
    getDelay : ()=> new Promise(r => setTimeout(r, 0.33 * vars.speed))
}

//action:
{
    let sp = new SortPad(vars.can_width, vars.can_height);

    window.sp=sp;
    setListeners();

    sp.init(vars.base_size_arr + 25);
}
