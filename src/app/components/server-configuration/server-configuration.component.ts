import { Component, OnInit, Input } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import Swal from 'sweetalert2'
import { RestService } from '../../services/rest.service';
import { interval } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-server-configuration',
  templateUrl: './server-configuration.component.html',
  styleUrls: ['./server-configuration.component.css']
})
export class ServerConfigurationComponent implements OnInit {

  form: FormGroup;
  
  defaultServerAddress: string;
  useDefaultServer = false;

  isOnline = false;
  isOnline$ = interval(3000).subscribe(() => {
    this.restService.getGameList().subscribe(response => {
      this.isOnline = true;
    },(error: any) => {
      this.isOnline = false;
    });
  });;
  
  constructor(private pagesService: PagesService,
              private restService: RestService,
              private formBuilder: FormBuilder) {
    this.buildForm();
    this.defaultServerAddress = this.restService.getDefaultServerAddress();
  }
  /**
   * Triggered the methods when the page is initializing.
   */
  ngOnInit(): void {
    this.loadForm();
  }
  /**
   * Triggered the methods when the page is destroyed.
   */
  ngOnDestroy(): void {
    this.isOnline$.unsubscribe();
  }
  /**
   * Load the form with an empty filter.
   */
  loadForm(): void {
    this.useDefaultServer = this.restService.getUseDefaultServer();
    this.updateSwitchDefaultServer();
  }
  /**
   * Builds the filter form.
   */
  buildForm() {
    this.form = this.formBuilder.group({
      serverAddress: [this.defaultServerAddress, [Validators.required, Validators.minLength(3)]]
      });
  }
  /**
   * Goes to the previous page.
   */
  goBack(){
    this.pagesService.goBack();
  }
  /**
   * Switches the status.
   */
  switchDefaultServer() {
    this.useDefaultServer = !this.useDefaultServer;
    this.updateSwitchDefaultServer();
  }
  /**
   * Updates the data of the forms.
   */
  private updateSwitchDefaultServer(): void {
    if(this.useDefaultServer) {
      this.form.controls['serverAddress'].disable();
      this.form.setValue({'serverAddress': this.defaultServerAddress});
    } else {
      this.form.setValue({'serverAddress': this.restService.getCustomServerAddress()});
      this.form.controls['serverAddress'].enable();
    }
  }
  /**
   * Action when the submit button is pressed.
   * @returns 
   */
  onSubmit() {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach(control => control.markAllAsTouched());
    } 
    Swal.fire({
      title: '¿Desea guardar la configuración?',
      imageUrl: 'https://cdn.icon-icons.com/icons2/1152/PNG/512/1486506244-help-info-notification-information-sign_81473.png',
      imageWidth: 200,
      imageHeight: 200,
      //icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isOnline = false;
        if(!this.useDefaultServer) {
          this.restService.setCustomServerAddress(this.form.get('serverAddress').value);
        }
        this.restService.setUseDefaultServer(this.useDefaultServer);
        
        Swal.fire(
          'Datos guardados',
          'Configuración del servidor actualizada',
          'success'
        )
      }
    })
  }
  /**
   * True when the serverAddress is invalid, false otherwise.
   */
  get serverAddressInvalid(): boolean {
    return this.form.get('serverAddress').invalid && this.form.get('serverAddress').touched;
  }
  /**
   * Disables the submit button when:
   * - The form has been changed.
   * - The changes are the same.
   * @returns 
   */
  disableButton(): boolean {
    return this.useDefaultServer == this.restService.getUseDefaultServer() && (!this.useDefaultServer && !this.form.touched)
  }
  

}
