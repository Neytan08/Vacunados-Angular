import { PagesService } from '../../services/pages.service';
import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  gameStatusChecked = false;
  gameStatus$: Subscription;

  constructor(public restService:RestService, private pagesService: PagesService) { }
  
  ngOnInit(){ 
    this.pagesService.checkGameStatus();
    this.gameStatus$ = interval(1000).subscribe(() => {
      this.gameStatusChecked = this.pagesService.gameStatusChecked;
      this.stopGameStatusCheck();
      }, (error:any) => { 
        
      });
   }
  /**
   * Triggered when the pages is destroyed.
   */
  ngOnDestroy(): void {
    this.stopGameStatusCheck();
  }

  private stopGameStatusCheck(): void {
    this.gameStatus$.unsubscribe();
  }

  showCreateFindGame(): void{
    this.pagesService.changePage('create-find-game')
  }
}
