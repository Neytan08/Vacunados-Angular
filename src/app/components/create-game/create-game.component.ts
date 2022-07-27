
import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { PagesService } from '../../services/pages.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {
  
  form: FormGroup;

  constructor(private restService:RestService, 
              private pagesService: PagesService,
              private formBuilder: FormBuilder) { 
    this.buildForm();
  }

  ngOnInit(): void {
  }
  /**
   * Builds the forms and input validators.
   */
  buildForm() {
    this.form = this.formBuilder.group({
      gameName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      gamePassword: ['']
    });
  }
  /**
   * Goes to the previous page.
   */
  goBack(){
    this.pagesService.goBack();  
  }
  /**
   * Action triggered when the submit button is pressed. 
   * Checks if the form is valid and then creates a new game.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach(control => control.markAllAsTouched());
    } 
    const username = this.restService.getUsername();
    const gameName = this.form.get('gameName').value;
    const gamePassword = this.form.get('gamePassword').value;
    
    this.restService.createGame(username, gameName, gamePassword).subscribe((response) => {
      this.restService.setGameId(response.gameId);
      this.restService.setGamePassword(response.password);
      this.restService.setGameName(response.name);

      this.pagesService.changePage('lobby');
      
    }, (error: any) => {
      this.handleResponseError(error);
    });
  }
  /**
   * Check if the gameName is invalid.
   */
  get gameNameInvalid(): boolean {
    return this.form.get('gameName').invalid  && this.form.get('gameName').touched;
  }

  /**
   * Handles the error messages.
   * @param error error http response.
   * @param game game data.
   */
  private handleResponseError(error: any){

  let title = '';
  let text = ''; 

  if(error.status == 406) { // Missing name header or game name parameters.
    title = 'La partida no ha sido creada';
    text = `Error: No se encontró el nombre del jugador o el nombre de la partida.`; 
  } else if(error.status >= 500) {
    title = 'Error al crear la partida';
    text = `Error: ${error.error.error}`
  }

  Swal.fire({
    icon: 'error',
    title: title,
    text: text
  })
    }
}
