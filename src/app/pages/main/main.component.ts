import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private pagesService: PagesService) { }

  ngOnInit(): void {
  }


  getSelectedPage(): string{
    return this.pagesService.getSelectedPage();
  }

  hideNavbar(): boolean{
    return this.getSelectedPage() == 'configuration' ||
    this.getSelectedPage() == 'server-configuration';
  }
}
