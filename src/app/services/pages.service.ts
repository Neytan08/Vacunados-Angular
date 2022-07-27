import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  
  gameStatusChecked = false;
  selectedPage = 'home';
  lastSelectedPage = 'home';

  constructor(private restService: RestService) { }

  changePage( pageName: string ): void {
    if (pageName != this.selectedPage) {
      this.lastSelectedPage = this.selectedPage
      this.selectedPage = pageName;
    }
  }

  checkGameStatus(): void {
    this.gameStatusChecked = false;

    const username = this.restService.getUsername();
    const gameId = this.restService.getGameId();
    const gamePassword = this.restService.getGamePassword();

    if(username != null && gameId != null) {
        this.restService.getRound(username, gameId, gamePassword).subscribe(response => {          
          if(response.status == 'lobby') {
            this.changePage('lobby');
          } else if(response.status == 'rounds' || response.status == 'leader'){
            this.changePage('in-game');
          }
          this.gameStatusChecked = true;
        });
    } else {
      this.gameStatusChecked = true;
    }
  }
  getSelectedPage(): string{
    return this.selectedPage;
  }

  goBack(): void{
    this.selectedPage = this.lastSelectedPage;
  }
}
