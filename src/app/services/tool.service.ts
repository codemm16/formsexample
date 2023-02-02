import { Injectable } from '@angular/core';
import { Observable,of } from "rxjs"
import { catchError,delay } from "rxjs/operators"

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor() { }


  sendPrimaryTool(data:any):Observable<any>{
    return of(
      {
        ok:true,
        id: Math.ceil(Math.random() * 1000)
      }
      ).pipe(
      delay(1000),
      catchError( () => {
        return of({
          ok: false
        })
      } )

    )
  }

  sendSecondaryTool(data:any,id:any):Observable<any>{
    return of({
        res:true,
        data,
        id
      }).pipe(
      delay(5),
      catchError( () => {
        return of({
          res: false,
        })
      } )

    )
  }
}
