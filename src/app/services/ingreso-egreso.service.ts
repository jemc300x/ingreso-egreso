import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc } from '@angular/fire/firestore';
import { addDoc, collection, onSnapshot } from '@firebase/firestore';
import { Unsubscribe } from '@firebase/util';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import IngresoEgreso from '../shared/models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  unSubscribe!: Subscription;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) { }

  crearIngresoEngreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.user?.uid;
    return this.firestore.doc(`${uid}/ingreso-egreso`)
      .collection('items')
      .add({
        description: ingresoEgreso.description,
        type: ingresoEgreso.type,
        amount: ingresoEgreso.amount
      });
  }

  initIngresosEgresosListening(uid: string) {
    return this.firestore.collection(`${uid}/ingreso-egreso/items`)
      .snapshotChanges()
      .pipe(
        map(snapshot => snapshot.map(doc => ({
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data() as any
          })
        ))
      );
  }

  deleteIngresoEgreso(uidItem: string) {
    const uid = this.authService.user?.uid;
    return this.firestore.doc(`${uid}/ingreso-egreso/items/${uidItem}`).delete();    
  }


}
