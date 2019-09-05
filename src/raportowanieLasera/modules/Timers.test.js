import { Observable, Subject, ReplaySubject, range } from 'rxjs'
import { Rx, from, of, interval, concat } from 'rxjs'
import { take } from 'rxjs/operators'

test('Rx.userDefined', () => {
    const userDefined = () => (source) => new Observable((subscriber) => {
        source.subscribe({
            next(value) { subscriber.next(value); },
            error(err) { subscriber.error(err); },
            complete() { subscriber.complete(); },
        });
  });
    userDefined().subscribe(
        val => console.log(val)
    )
            
})
             
        
test('Rx.create', () => {
var source = Observable.create(observer => {
        // Yield a single value and complete
        observer.onNext(42);
  observer.onCompleted();
  
    // Any cleanup logic might go here
    return () => console.log('disposed')
  });
  
  var subscription = source.subscribe(
      x => console.log('onNext: %s', x),
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
  );
  
  // => onNext: 42
  // => onCompleted
  
  //subscription.dispose();
  // => disposed
})
