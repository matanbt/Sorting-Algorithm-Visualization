import {vars, Bar} from './index.js';

export const sortingAlgoVis = {
    bubble: async (sortpad) => {
        let arr = sortpad.orig_arr;


        for (let i = 0; i < arr.length - 1; i++) {
            let elementSwapped = false;

            for (let j = 0; j < arr.length - 1 - i; j++) {
                //last i elements are sorted

                sortpad.updateStatus(j + 1, Bar.status_options.candidate);
                await vars.getDelay();

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    sortpad.switchBetween(j, j + 1);
                    elementSwapped = true;

                    await vars.getDelay;
                }

                sortpad.updateStatus(j, Bar.status_options.inactive);
                sortpad.updateStatus(j + 1, Bar.status_options.active);
                await vars.getDelay();

            }
            sortpad.updateStatus(arr.length - 1 - i, Bar.status_options.sorted);


            if (!elementSwapped) {
                sortpad.setSorted();
                return;
            } //all sorted

        }

        sortpad.setSorted();
    },

    merge: async (sortpad) => {
        //INPLACE implementation (costs O(n^2) with O(1) memory)

        const merge_rec = async (sortpad, arr, l, r) => {
            if (r > l) {
                let m = parseInt((l + r) / 2);
                await merge_rec(sortpad, arr, l, m);
                await merge_rec(sortpad, arr, m + 1, r);


                sortpad.updateStatusOfRange(l, r, Bar.status_options.group_active);
                await vars.getDelay();
                await mergeSortedArrays(sortpad, arr, l, m, m + 1, r);


            }
        };

        const mergeSortedArrays = async (sortpad, arr, l_1, r_1, l_2, r_2) => {
            //get two sorted 'sub arrays' (l_1 --> r_1 AND l_2 --> r_2), and merge sort them
            //assumes r_1 + 1 === l_1, i.e. 'sub arrays' are in sequence inside arr

            let [i, j] = [l_1, l_2];

            while (i <= r_1 && j <= r_2) {

                if (arr[i] <= arr[j]) {
                    sortpad.updateStatus(i, Bar.status_options.sorted);
                    i++;
                } else {
                    sortpad.updateStatus(j, Bar.status_options.active);
                    await vars.getDelay();
                    //shift all elements from i (inclusive) to the right
                    let temp = arr[j];
                    for (let k = j - 1; k >= i; k--) {
                        arr[k + 1] = arr[k];
                        sortpad.switchBetween(k + 1, k);
                        await vars.getDelay();
                    }
                    arr[i] = temp;

                    sortpad.updateStatus(i, Bar.status_options.sorted);

                    //boundaries of the 'sub' arrays has changed:
                    r_1++;
                    i++;

                    j++;
                }

                await vars.getDelay();
            }
            sortpad.updateStatusOfRange(l_1, r_2, Bar.status_options.sorted);
            await vars.getDelay();
        };

        let arr = sortpad.orig_arr;
        await merge_rec(sortpad, arr, 0, arr.length - 1);
        sortpad.setSorted();

    },

    insertion: async (sortpad) => {
        let arr = sortpad.orig_arr;

        for (let i = 0; i < arr.length; i++) {
            sortpad.updateStatus(i, Bar.status_options.active);
            await vars.getDelay();

            let j = i;
            while (j > 0 && arr[j] < arr[j - 1]) {
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
                sortpad.switchBetween(j, j - 1);
                await vars.getDelay();
                j--;
            }

            await vars.getDelay();
            sortpad.updateStatus(j, Bar.status_options.sorted);
            await vars.getDelay();
        }

        sortpad.setSorted();
    },

    quick: async (sortpad) => {
        //quick sort implmentation, with lomuto's partitions and randomized pivot

        const quick_rec = async (sortpad, arr, l, r) => {
            if (r > l) {
                //casts a pivot:
                let pivot = Math.floor(Math.random() * (r - l + 1)) + l;
                sortpad.updateStatus(pivot, Bar.status_options.candidate);

                //partition in-place by the pivot
                pivot = parseInt(await partition(sortpad, arr, l, pivot, r));

                await quick_rec(sortpad, arr, l, pivot - 1);
                await quick_rec(sortpad, arr, pivot + 1, r);

            } else if (r === l) {
                sortpad.updateStatus(r, Bar.status_options.sorted);
                await vars.getDelay();
            }
        };

        const partition = async (sortpad, arr, l, p, r) => {
            //lomuto's partition
            let pivot = arr[p];
            //place pivot at the end:
            [arr[p], arr[r]] = [arr[r], arr[p]];
            sortpad.switchBetween(r, p);
            sortpad.updateStatusOfRange(l, r - 1, Bar.status_options.group_active);
            await vars.getDelay();

            let j = l; //next indice of small elements

            for (let i = l; i <= r - 1; i++) {
                sortpad.updateStatus(i, Bar.status_options.active);
                await vars.getDelay();
                if (arr[i] <= pivot) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    sortpad.switchBetween(j, i);
                    await vars.getDelay();

                    sortpad.updateStatus(j, Bar.status_options.group_active);

                    j++;
                } else {
                    sortpad.updateStatus(i, Bar.status_options.group_active);
                }
            }

            sortpad.updateStatusOfRange(l, r - 1, Bar.status_options.inactive);
            //gets the pivot to its sorted location (j):
            [arr[r], arr[j]] = [arr[j], arr[r]];
            sortpad.switchBetween(j, r);
            await vars.getDelay();
            sortpad.updateStatus(j, Bar.status_options.sorted);
            await vars.getDelay();
            return j;
        };

        let arr = sortpad.orig_arr;
        await quick_rec(sortpad, arr, 0, arr.length - 1);

        sortpad.setSorted();
    },
}


//helpers functions:
export const helpers = {
    makeRandomArray: (len) => {
        //makes array from given length with values 0<=val<1
        return Array(len).fill(0).map(() => Math.random());
    },

}

