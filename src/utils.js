export let getRandomItemNumber = (arr) => {
    return arr[Math.floor(arr.length * Math.random())];
};

export let getRandomItems = (arr, factor = 15) => {
    return arr.filter(item => Math.random() * 100 < factor);
};

