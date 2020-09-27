import {vars} from './index.js';
import {sortingAlgoVis} from "./sortingAlgo.js";


const views = {
    gen_arr: document.getElementById('gen_Arr'),
    speed: document.getElementById('speed'),
    arr_size: document.getElementById('size'),
    algo_badges_div: document.querySelector('#algorithms_div'),
    algo_badges: document.querySelector('#algorithms_div').querySelectorAll('a'),
    chosen_algo: () => document.querySelector('#algorithms_div').querySelectorAll('a.badge-primary'),
    run: document.getElementById('run'),

    disableOnSort: (disable) => {
        views.arr_size.disabled = disable;
        views.run.disabled = disable;
        if (disable) views.gen_arr.classList.add('disabled-link');
        else views.gen_arr.classList.remove('disabled-link');

        vars.isRunning = disable;
    },

    unchooseAllAlgo: () => {
        for (let a of views.algo_badges) {
            a.classList.remove('badge-primary');
            a.classList.add('badge-secondary');
        }
    },

    chooseAlgo: (chosen_a) => {
        chosen_a.classList.remove('badge-secondary');
        chosen_a.classList.add('badge-primary');
    }
}

//set Listeners
export const setListeners = () => {
    let sp = window.sp;
    //todo set values from vars in inputs

    //Size range:
    views.arr_size.addEventListener('input', () => {
        let val = parseInt(views.arr_size.value);
        if (val >= 95) {
            val = val * 3;
        }
        sp.init(vars.base_size_arr + val);
    });

    //Speed range:
    views.speed.addEventListener('input', () => {
        let val = 100 - parseInt(views.speed.value);
        if (val >= 97) {
            //really slow
            vars.speed = 700;
        } else if (val <= 3) {
            //really fast
            vars.speed = 0.01;
        } else {
            vars.speed = val * 3;
        }
    });

    //Generate array:
    views.gen_arr.addEventListener('click', event => {
        if (!vars.isRunning) {
            sp.init();
        }
        event.preventDefault();
    });

    //Run:
    views.run.addEventListener('click', async () => {
        views.disableOnSort(true);
        sp.toggleRun();
        await sortingAlgoVis[vars.algorithm](sp);
        sp.toggleRun();
        views.disableOnSort(false);
    });

    views.algo_badges_div.addEventListener('click', event => {
        event.preventDefault();
        if (!vars.isRunning && event.target.closest('a')) {
            let chosen_a = event.target.closest('a');
            if (chosen_a === views.chosen_algo())
                return;
            views.unchooseAllAlgo();
            views.chooseAlgo(chosen_a);
            vars.algorithm = chosen_a.textContent.trim().toLowerCase();
        }
    });
};
