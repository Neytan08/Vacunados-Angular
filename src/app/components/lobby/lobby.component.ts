import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PagesService } from '../../services/pages.service';
import { RestService } from '../../services/rest.service';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  gameId = this.rest.getGameId();
  gamePassword = this.rest.getGamePassword();
  gameName = this.rest.getGameName();
  startingGame = false;
  
  playerList: string[];
  playerList$: Subscription;
  playerListLoaded = false;

  constructor(public rest:RestService, private pagesService: PagesService) { }
  /**
   * Triggered when the page is initializing.
   */
  ngOnInit(): void {
    this.hideStartButton();
    this.playerList$ = this.updatePlayerList();
  }
  /**
   * Observable of the list of players.
   * @returns 
   */
  updatePlayerList(): Subscription {
    return interval(2000).subscribe(() => {
      this.rest.getRound(this.rest.getUsername(), this.gameId, this.gamePassword).subscribe((response) => {
        this.playerList = response.players;
        this.playerListLoaded = true;

        if(this.rest.getUsername() === response.owner){
          document.getElementById("startButton").style.visibility = "visible";
        }

        this.checkGameStatus(response.status);
      });
    });;
  }
  /**
   * Starting game message.
   */
  startingGameAwait() {
    return new Promise(resolve => {
            setTimeout(() => {this.pagesService.changePage('in-game'); 
          }, 3000);
    });
  }

  /**
   * Set the start button as hidden.
   */
  hideStartButton(): void {
    document.getElementById("startButton").style.visibility = "hidden";
  }
  /**
   * Triggered when the page is destroyed.
   */
  ngOnDestroy(): void {
    this.playerList$.unsubscribe();
  }
  /**
   * Go to the previous page.
   */
  goBack(): void{
    Swal.fire({
      title: '¿Desea salir de la partida?',
      imageUrl: 'https://cdn.icon-icons.com/icons2/1499/PNG/512/emblemimportant_103451.png',
      imageWidth: 150,
      imageHeight: 150,
      //icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.rest.leaveGame();
        this.pagesService.changePage('create-find-game');
      }
    });
  }
  /**
   * Starts the game.
   */
  gameStart(): void {
    this.rest.gameStart(this.gameId, this.rest.getUsername(), this.gamePassword ).subscribe(() => {
      this.startingGame = true;
    }, (error: any) => {
      this.handleResponseError(error, this.gameName);
    });
  }
  /**
   * True if the game can start, false otherwise.
   */
  get canStart(): boolean {
    return this.playerList != null && this.playerList.length >= 5;    
  }
  /**
   * Checks the game status.
   * @param gameStatus Status of the game.
   */
  private checkGameStatus(gameStatus: string): void {
    if(gameStatus == 'leader' || gameStatus == 'rounds'){
      this.startingGame = true;
      this.startingGameAwait();
    }
  }
  /**
   * Handles the error messages.
   * @param error error http response.
   * @param game game data.
   */
   private handleResponseError(error: any, gameName: string){
    let title = '';
    let text = ''; 
    if(error.status == 401) { // You are not the game's owner
      title = 'No puede iniciar la partida';
      text = 'Solo el dueño puede iniciar la partida';
    } else if(error.status == 403) { // You are not part of the players list
      title = 'Accesso denegado';
      text = 'tu nombre no está en la lista de jugadores de esta partida.'; 
    } else if(error.status == 404) { //	Invalid Game's id
      title = 'No se encontró la sala';
      text = `Error al conectar con la sala ${gameName}.`; 
    } else if(error.status >= 500) {
      title = 'Error al iniciar la partida';
      // text = `Error: ${error.error.error}`
    }
    Swal.fire({
      icon: 'error',
      title: title,
      text: text
    })
  }

}
