import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { PagesService } from '../../services/pages.service';
import { RestService } from '../../services/rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-find-game',
  templateUrl: './find-game.component.html',
  styleUrls: ['./find-game.component.css']
})
export class FindGameComponent implements OnInit, OnDestroy {

  form: FormGroup;
  gamesList : any = [];
  filter : string = '';
  gamesListLoaded = false;
  
  searchIcon = 'assets/icons/search1.png';

  errorResponse = false;
  loadingMessages = {searchGames : 'Buscando', errorResponse : 'Conectado con el servidor'};

  gamesList$ = interval(3500).subscribe(() => {
    this.restService.getGameList().subscribe((response) => {
      this.gamesList = response;
      this.gamesListLoaded = true;
      this.errorResponse = false;

    }, (error:any) => { 
      if(!this.errorResponse){

        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Se perdió la conexión con el servidor.',
          showConfirmButton: false,
          timer: 5000
        })

        this.errorResponse = true;
        this.gamesListLoaded = false;
      }
    });
  });;

  constructor(private pagesService: PagesService,
              private restService: RestService,
              private formBuilder: FormBuilder) {
    this.buildForm();
    this.createListeners();
  }
  /**
   * Triggered when the page is initialize.
   */
  ngOnInit(): void {
    this.loadForm();
  }
  /**
   * Triggered when the page is destroyed.
   */
  ngOnDestroy(): void {
    this.gamesList$.unsubscribe();
  }
  /**
   * Builds the filter form.
   */
  buildForm() {
    this.form = this.formBuilder.group({
      name: ['']
    });
  }
  /**
   * Load the form with an empty filter.
   */
  loadForm(): void {
    this.form.setValue({'name': ''});
  }

  /**
   * Listeners to filter the list.
   */
  createListeners() {
    this.form.valueChanges.subscribe( value => {
      this.filter = value['name'];
    })
  }
  /**
   * Go to create-find-game
   */
  goBack(){
    this.pagesService.changePage('create-find-game');
  }
  /**
   * Try to join a game.
   * @param game to join.
   */
  joinGame(game: any): void{
    const name = this.restService.getUsername();
    Swal.fire({
      title: 'Ingrese la contraseña de la partida',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Ingresar',
      showLoaderOnConfirm: true,
    preConfirm: (password) => {
      
      return this.restService.joinGame(game.gameId, name, password).subscribe(response =>{
        this.restService.setGameId(game.gameId);
        this.restService.setGameName(game.name);
        this.restService.setGamePassword(password);
        this.pagesService.changePage('lobby');
        return response.message
      }, (error: any) => {
        this.handleResponseError(error, game);
      })  
    },
    toast: true           
  });
  }
  /**
   * Gets the list of games filtered by name.
   * @returns filtered list by name
   */
  getFilteredList(): []{
    let filteredList: any = [];
    for(const idx in this.gamesList){
      const game = this.gamesList[idx]
      if(game.name.toLowerCase().includes(this.filter.toLowerCase())){
        filteredList.push(game);
        
      }
      if(game.gameId.toLowerCase().includes(this.filter.toLowerCase())){
        filteredList.push(game);
        
      }
    }
    return filteredList;
  }

  /**
   * Checks if the filtered list of games is not empty.
   */
  get gamesFound(): boolean{
    return this.getFilteredList().length == 0 && this.gamesListLoaded;
  }

  getLoadingMessage(): string {
      return this.errorResponse? this.loadingMessages.errorResponse : this.loadingMessages.searchGames;
    
    
  }
  /**
   * Handles the error messages.
   * @param error error http response.
   * @param game game data.
   */
  private handleResponseError(error: any, game: any){
    let title = '';
    let text = ''; 
    if(error.status == 403) { // You are not part of the players list
      title = 'Accesso denegado';
      text = 'La contraseña es incorrecta.'; 
    } else if(error.status == 404) { //	Invalid Game's id
      title = 'No se encontró la sala';
      text = `Error al conectar con la sala ${game.gameName}.`; 
    } else if(error.status == 406) { //	Game has already started or is full
      title = 'Partida en progreso';
      text = 'Error, el juego ha comenzado o la sala está llena.'; 
    } else if(error.status == 409) { // You are already part of this game
      title = 'Nombre de usuario en uso';
      text = `Ya hay un jugador con el nombre ${this.restService.getUsername()}. Puedes cambiar el nombre o elegir otra sala.`;
    } else if(error.status >= 500) {
      title = 'Error al unirse a la partida';
      text = `Error: ${error.error.error}`
    }
    Swal.fire({
      icon: 'error',
      title: title,
      text: text
    })
  }
}
