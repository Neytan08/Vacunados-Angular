import { Component, OnInit, SimpleChanges } from '@angular/core';
import { PagesService } from '../../../services/pages.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private pagesService: PagesService) { }

  configIcon = 'assets/icons/settingsIcon.png'
  serverConfigIcon = 'assets/icons/server1.png'
  
  ngOnInit(): void {
  }  

  showServerConfiguration(){
    this.pagesService.changePage('server-configuration')
  }

  showConfiguration(){
    this.pagesService.changePage('configuration')
  }

  getSelectedPage(): string{
    return this.pagesService.getSelectedPage();
  }

  get showLogo() : boolean {
    return this.pagesService.getSelectedPage() != 'home';
  }
}
