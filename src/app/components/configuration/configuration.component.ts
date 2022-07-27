import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import { RestService } from '../../services/rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(private pagesService: PagesService, 
              private restService: RestService) { }

  ngOnInit(): void {
  }

  goBack(){
    this.pagesService.goBack();
    
  }

  get disableButton(): boolean{
    return localStorage.length == 0;
  }
  /**
   * Deletes all the data.
   */
  deleteData(): void{
    Swal.fire({
      title: '¿Desea borrar toda la información?',
      text: "Esta operación es irreversible",
      imageUrl: 'https://cdn.icon-icons.com/icons2/1499/PNG/512/emblemimportant_103451.png',
      imageWidth: 150,
      imageHeight: 150,
      //icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.restService.deleteData();
        Swal.fire(
          'Datos eliminados',
          'Información eliminada correctamente',
          'success'
        )
      }
    })
  }

  
}
