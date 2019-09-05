import { interval, timer } from 'rxjs';
import { take } from 'rxjs/operators';

export const afterSecondsOf = (sec) => timer(sec * 1000) // jeśli timer to wywołanie raz po [sec] sekundach

export const countDownSecondsOnTickOnComplete = (sec, onTick, onComplete) => {
    return interval(1000).pipe(take(sec)).subscribe(x => onTick(sec-x), err => { }, onComplete);
}

//countDownSecendsOnTickOnComplete(30, x => console.log('Next: ', x), () => console.log('complete'))

// const numbers = interval(1000);
// const takeFourNumbers = numbers.pipe(take(4));
// takeFourNumbers.subscribe(x => console.log('Next: ', x),
//     err => { console.log('Err: ', err)},
//     compl => { console.log('complete: ', compl)});


// const timeout = 30
// interval(1000).pipe(take(timeout))
