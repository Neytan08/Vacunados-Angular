import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/* Routes */
import{ APP_ROUTING } from './app.routes';

/* Components */
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { MainComponent } from './pages/main/main.component';
import { CreateFindGameComponent } from './components/create-find-game/create-find-game.component';
import { ServerConfigurationComponent } from './components/server-configuration/server-configuration.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { FindGameComponent } from './components/find-game/find-game.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { InGameComponent } from './components/in-game/in-game.component';
import { FinishGameComponent } from './components/finish-game/finish-game.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ConfigurationComponent,
    MainComponent,
    CreateFindGameComponent,
    ServerConfigurationComponent,
    CreateGameComponent,
    FindGameComponent,
    LobbyComponent,
    InGameComponent,
    FinishGameComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    APP_ROUTING,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
