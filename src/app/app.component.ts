import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolService } from './services/tool.service';
import { mergeMap, Subscription,of} from 'rxjs';
import { RestService } from './services/rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{

  secondaryToolsSelectedArray:any[] = [];
  private subscriptions: Subscription[] = [];

  private fileTmp:any;

  secondaryToolsOptions = [
    { value: 'secondaryTool1', viewValue:'secondaryTool 1' },
    { value: 'secondaryTool2', viewValue:'secondaryTool 2' },
    { value: 'secondaryTool3', viewValue:'secondaryTool 3' },
  ]

  constructor(
    private _fb: FormBuilder,
    private _toolService: ToolService,
    private restService: RestService
  ){}

  public myForm: FormGroup = this._fb.group({
    name: ['Tool special'],
    secondaryTool : [ '', [Validators.required]],
    file : [ '', [Validators.required]]
    
  });

  selectSecondaryTool(tool:any){
    this.secondaryToolsSelectedArray.push(tool)
  }


  submit(){


    console.log(this.myForm.value)

    const data =  {
      name:this.myForm.value.name,

    }

    this._toolService.sendPrimaryTool(data)
    .subscribe( res => {
      console.log(res)
      this.sendFile()
      //ENVIAR LAS HERRAMIENTAS SECUNDARIAS
      // console.log(finalRes)
      for (let i = 0; i < this.secondaryToolsSelectedArray.length; i++) {
        this.subscriptions.push(
          this._toolService.sendSecondaryTool(i,res.id).subscribe(data => {
            console.log(data)
          })
        );
      }

    } )

  
  
  }
   

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

  }

  getFile($event: any): void {
    //TODO esto captura el archivo!
    const [ file ] = $event.target.files;
    this.fileTmp = {
      fileRaw:file,
      fileName:file.name
    }
    
  }

  sendFile():void{
    console.log('ENVIANDO ARCHIVO')
    const body = new FormData();
    body.append('myFile', this.fileTmp.fileRaw, this.fileTmp.fileName);
    body.append('email','test@test.com')

    this.restService.sendPost(body)
    .subscribe((res:any) => {
      console.log('ARCHIVO ENVIADO ')
      console.log(res)
    })
  }
}
