import { Injectable } from '@angular/core';
import {Mensaje} from '../interface/mensaje.interface';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


@Injectable()
export class ChatService {

  private itemsCollection:AngularFirestoreCollection<Mensaje>
  public chats:Mensaje[]=[];
  public  usuario:any={};





  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {

                  this.afAuth.authState.subscribe(user=>{
                    console.log('Estado usuarioa: ',user);
                    if(!user){
                      return
                    }
                    this.usuario.nombre=user.displayName;
                    this.usuario.uid=user.uid
                  })
              }
  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats',ref=>ref.orderBy('fecha','desc').limit(10));
    return this.itemsCollection.valueChanges()
    .map((mensajes:Mensaje[])=>{
      console.log(mensajes)
      this.chats=[];
      for(let mensaje of mensajes){
        this.chats.unshift(mensaje);
      }
      return this.chats;
    });
  }
  agregarMensaje(texto:string){
    let mensaje:Mensaje={
      nombre:this.usuario.nombre,
      mensaje:texto,
      fecha:new Date().getTime(),
      uid:this.usuario.uid
    }
  return  this.itemsCollection.add(mensaje);
  }
  login(proveedor:string){
    if(proveedor==="google"){
     this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
   }else{
     this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
   }



  }
  logout() {
    this.usuario={};
     this.afAuth.auth.signOut();
   }
}
